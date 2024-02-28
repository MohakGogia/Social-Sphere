import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from './../core/interfaces/user-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user-model';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { UserService } from '../core/services/user/user.service';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { FileUpload } from 'primeng/fileupload';
import { PhotoService } from '../core/services/photo/photo.service';
import { AppConstants } from '../core/constants/app.constant';
import { PhotoDTO } from '../core/interfaces/photo-dto';
import { forkJoin } from 'rxjs';
import { CommonService } from '../shared/services/common/common.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  userDetails: UserDTO | null;
  userDetailsForm: FormGroup;
  loggedInUser: User;
  genderList = [ 'Male', 'Female', 'Other' ];
  imgSrc: string;

  @ViewChild('toast') toast: ToastComponent;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private photoService: PhotoService,
    private commonService: CommonService) {}

  ngOnInit(): void {
    this.userDetails = this.route.snapshot.data['user'];
    this.loggedInUser = this.authService.getLoggedInUser();
    this.imgSrc = (this.commonService.isNullOrUndefined(this.userDetails?.profileImageUrl) || this.commonService.isEmpty(this.userDetails?.profileImageUrl))
      ? AppConstants.defaultProfileImgSrc : this.userDetails?.profileImageUrl as string;
    this.initializeForm();
  }

  onSubmit() {
    if (this.userDetailsForm.invalid) {
      return;
    }

    const formData: UserDTO = {
      userName: this.userDetailsForm.value.userName,
      dateOfBirth: this.userDetailsForm.value.dateOfBirth,
      gender: this.userDetailsForm.value.gender,
      bio: this.userDetailsForm.value.bio,
      interests: this.userDetailsForm.value.interests,
      city: this.userDetailsForm.value.city,
      country: this.userDetailsForm.value.country,
      email: this.loggedInUser.email
    };

    this.spinnerService.spinnerStart();
    this.userService.saveUser(formData).subscribe({
      next: (res) => {
        this.toast.showSuccess({ title: 'Success', message: 'Profile updated successfully.' });
        this.userDetails = res;
        this.userDetailsForm.markAsPristine();
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
        this.toast.showDefaultErrorNotification();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  onProfilePictureUpload(event: UploadEvent, fileUploadRef: FileUpload) {
    fileUploadRef.clear();

    if (this.commonService.isNullOrUndefined(this.userDetails?.id)) {
      this.toast.showError({ title: 'Error', message: 'Please save your information first before updating the profile picture.' });
      return;
    }

    if (event.files[0].size > 1000000 || (['image/jpeg','image/png'].includes(event.files[0].type) === false)) {
      this.toast.showError({ title: 'Error', message: 'Please upload a valid image of size less than 1MB.' });
      return;
    }

    if (this.userDetails?.profileImageUrl !== '') {
      this.spinnerService.spinnerStart();
      this.photoService.deleteAndAddPhoto(this.userDetails?.profileImagePublicId as string, event.files[0], this.userDetails?.id as number, true).subscribe({
        next: (res: PhotoDTO) => {
          this.handlePhotoUploadSuccess(res);
        },
        error: () => {
          this.handlePhotoUploadError();
        },
        complete: () => {
          this.handlePhotoUploadComplete();
        }
      });
      return;
    }

    this.spinnerService.spinnerStart();
    this.photoService.addPhoto(event.files[0], this.userDetails?.id as number, true).subscribe({
      next: (res: PhotoDTO) => {
        this.handlePhotoUploadSuccess(res);
      },
      error: () => {
        this.handlePhotoUploadError();
      },
      complete: () => {
        this.handlePhotoUploadComplete();
      }
    });
  }

  onPhotoDelete(photo: PhotoDTO) {
    this.spinnerService.spinnerStart();
    forkJoin({
      deletePhotoResponse: this.photoService.deletePhoto(photo.publicId),
      deletePhotoFromDatabaseResponse: this.photoService.deletePhotoFromDatabase(photo.id as number)
    }).subscribe({
      next: () => {
        this.userDetails!.photos = this.userDetails?.photos?.filter(x => x.publicId !== photo.publicId);
        this.toast.showSuccess({ title: 'Success', message: 'Photo deleted successfully.' });
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
        this.toast.showDefaultErrorNotification();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  onUploadPhoto(event: UploadEvent, fileUploadRef: FileUpload) {
    fileUploadRef.clear();

    if (this.commonService.isNullOrUndefined(this.userDetails?.id)) {
      this.toast.showError({ title: 'Error', message: 'Please save your information first before adding photos.' });
      return;
    }

    if (event.files[0].size > 1000000 || (['image/jpeg','image/png'].includes(event.files[0].type) === false)) {
      this.toast.showError({ title: 'Error', message: 'Please upload a valid image of size less than 1MB.' });
      return;
    }

    this.spinnerService.spinnerStart();
    this.photoService.addPhoto(event.files[0], this.userDetails?.id as number, false).subscribe({
      next: (res: PhotoDTO) => {
        this.userDetails!.photos?.push(res);
        this.toast.showSuccess({ title: 'Success', message: 'Photo added successfully.' });
        this.spinnerService.spinnerTimeOut();
      },
      error: () => {
        this.handlePhotoUploadError();
      },
      complete: () => {
        this.handlePhotoUploadComplete();
      }
    });
  }

  getUserName() {
    return this.userDetails?.userName ?? this.loggedInUser?.userName;
  }

  private initializeForm(): void {
    this.userDetailsForm = this.fb.group({
      userName: [this.userDetails?.userName ?? this.loggedInUser?.userName, Validators.required],
      dateOfBirth: [this.userDetails !== null ? new Date(this.userDetails?.dateOfBirth) : null, Validators.required],
      gender: [this.userDetails?.gender, Validators.required],
      bio: [this.userDetails?.bio ?? ''],
      interests: [this.userDetails?.interests ?? ''],
      city: [this.userDetails?.city ?? ''],
      country: [this.userDetails?.country ?? ''],
    });
  }

  private handlePhotoUploadSuccess(res: PhotoDTO): void {
    this.userDetails!.profileImageUrl = res.url;
    this.userDetails!.profileImagePublicId = res.publicId;
    this.imgSrc = res.url;
    this.toast.showSuccess({ title: 'Success', message: 'Profile picture updated successfully.' });
    this.spinnerService.spinnerTimeOut();
  }

  private handlePhotoUploadError(): void {
    this.spinnerService.spinnerTimeOut();
    this.toast.showDefaultErrorNotification();
  }

  private handlePhotoUploadComplete(): void {
    this.spinnerService.spinnerTimeOut();
  }

}
