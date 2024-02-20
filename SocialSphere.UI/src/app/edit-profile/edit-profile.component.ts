import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from './../core/interfaces/user-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user-model';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { UserService } from '../core/services/user/user.service';
import { SpinnerService } from '../shared/services/spinner/spinner.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  userDetails: UserDTO | undefined;
  userDetailsForm: FormGroup;
  loggedInUser: User;
  genderList = [ 'Male', 'Female', 'Other' ];

  @ViewChild('toast') toast: ToastComponent;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.userDetails = this.route.snapshot.data['user'];
    this.loggedInUser = this.authService.getLoggedInUser();
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

  onPhotoUpload() {
    console.log('onPhotoUpload');
  }

  getUserName() {
    return this.userDetails?.userName ?? this.loggedInUser?.userName;
  }

  private initializeForm() {
    this.userDetailsForm = this.fb.group({
      userName: [this.userDetails?.userName ?? this.loggedInUser?.userName, Validators.required],
      dateOfBirth: [this.userDetails !== null ? new Date(this.userDetails?.dateOfBirth as Date) : null, Validators.required],
      gender: [this.userDetails?.gender, Validators.required],
      bio: [this.userDetails?.bio ?? ''],
      interests: [this.userDetails?.interests ?? ''],
      city: [this.userDetails?.city ?? ''],
      country: [this.userDetails?.country ?? ''],
    });
  }

}
