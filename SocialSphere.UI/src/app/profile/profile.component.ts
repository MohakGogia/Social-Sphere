import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../core/services/user/user.service';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { UserDTO } from '../core/interfaces/user-dto';
import { UserProfileTabs } from '../core/interfaces/enums';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { CommonService } from '../shared/services/common/common.service';
import { AppConstants } from '../core/constants/app.constant';
import { SignalRService } from '../shared/services/singalR/signalR.service';

interface ImageModel {
  imageSrc: string;
  thumbnailImgSrc: string;
  alt: string;
  title: string;
}

interface TabViewChangeEvent {
  index: number;
  originalEvent: Event;
}

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  loggedInUser: UserDTO;
  userDetails: UserDTO | null;
  activeTabIndex: UserProfileTabs = UserProfileTabs.About;
  locationDetails: string;
  images: ImageModel[] = [];
  responsiveOptions: any[];
  AppConstants = AppConstants;

  @ViewChild('toast') toast: ToastComponent;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private signalRService: SignalRService) { }

  async ngOnInit(): Promise<void> {
    this.loggedInUser = await this.userService.getLoggedInUser(false);
    this.userDetails = this.route.snapshot.data['user'];
    this.setUserProfilePictures();
    if (this.userDetails!.city.length > 0) {
      this.locationDetails = this.userDetails!.city;
    } else {
      this.locationDetails = '-';
    }
    if (this.userDetails!.country.length > 0) {
      this.locationDetails += `, ${this.userDetails!.country}`;
    }
  }

  switchToMessagesTab() {
    this.activeTabIndex = UserProfileTabs.Messages;
  }

  followUser() {
    if (this.commonService.isNullOrUndefined(this.loggedInUser?.followedUserIds) || this.commonService.isNullOrUndefined(this.userDetails?.id)) {
      return;
    }

    this.spinnerService.spinnerStart();
    this.userService.followUser(this.loggedInUser?.id as number, this.userDetails?.id as number).subscribe({
      next: () => {
        this.toast.showSuccess({
          title: 'Success',
          message: `You are now following ${this.userDetails?.userName}.`
        });
        this.loggedInUser?.followedUserIds?.push(this.userDetails?.id as number);
      },
      error: () => {
        this.toast.showError({
          title: 'Error',
          message: `You are already following ${this.userDetails?.userName}.`
        });
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  unFollowUser() {
    if (this.commonService.isNullOrUndefined(this.loggedInUser?.followedUserIds) || this.commonService.isNullOrUndefined(this.userDetails?.id)) {
      return;
    }

    this.spinnerService.spinnerStart();
    this.userService.unfollowUser(this.loggedInUser?.id as number, this.userDetails?.id as number).subscribe({
      next: () => {
        this.toast.showSuccess({
          title: 'Success',
          message: `You have unfollowed ${this.userDetails?.userName}.`
        });
        this.loggedInUser.followedUserIds = this.loggedInUser.followedUserIds?.filter(x => x !== this.userDetails?.id);
      },
      error: () => {
        this.toast.showError({
          title: 'Error',
          message: `You have already unfollowed ${this.userDetails?.userName}.`
        });
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  isUserFollowed(): boolean {
    return this.loggedInUser?.followedUserIds?.includes(this.userDetails?.id as number) ?? false;
  }

  private setUserProfilePictures() {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
    ];

    if (!this.userDetails?.photos?.length) {
      return;
    }
    this.images = this.userDetails.photos.map(x => ({
      imageSrc: x.url,
      thumbnailImgSrc: x.url,
      alt: 'image',
      title: 'title'
    }));
  }

  onTabChange($event: TabViewChangeEvent) {
    this.activeTabIndex = $event.index;
    if (this.activeTabIndex === UserProfileTabs.Messages && this.userDetails) {
      this.signalRService.createHubConnection(this.loggedInUser.userName, this.userDetails.userName);
    } else {
      this.signalRService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.signalRService.stopHubConnection();
  }

}
