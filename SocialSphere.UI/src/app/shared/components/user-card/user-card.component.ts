import { SignalRService } from './../../services/singalR/signalR.service';
import { UserService } from './../../../core/services/user/user.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserDTO } from 'src/app/core/interfaces/user-dto';
import { ToastComponent } from '../toast/toast.component';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CommonService } from '../../services/common/common.service';
import { AppConstants } from 'src/app/core/constants/app.constant';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: UserDTO;
  @Input() userId: number | undefined;
  @Input() followingUsersIdArray: number[] = [];
  @Input() followedByUsersIdArray: number[] = [];

  @Output() unfollowUserEventEmitter = new EventEmitter<number>();

  imgSrc: string;

  @ViewChild('toast') toast: ToastComponent;

  constructor(private userService: UserService,
    public signalRService: SignalRService,
    private spinnerService: SpinnerService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.imgSrc = (this.commonService.isNullOrUndefined(this.user?.profileImageUrl) || this.commonService.isEmpty(this.user?.profileImageUrl))
      ? AppConstants.defaultProfileImgSrc : this.user?.profileImageUrl as string;
  }

  followUser(user: UserDTO) {
    if (this.commonService.isNullOrUndefined(user?.id) || this.commonService.isNullOrUndefined(this.userId)) {
      return;
    }

    this.spinnerService.spinnerStart();
    this.userService.followUser(this.userId as number, user.id as number).subscribe({
      next: () => {
        this.toast.showSuccess({
          title: 'Success',
          message: `You are now following ${user.userName}.`
        });
        this.followingUsersIdArray.push(user.id as number);
      },
      error: () => {
        this.toast.showError({
          title: 'Error',
          message: `You are already following ${user.userName}.`
        });
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  unFollowUser(user: UserDTO) {
    if (this.commonService.isNullOrUndefined(user?.id) || this.commonService.isNullOrUndefined(this.userId)) {
      return;
    }

    this.spinnerService.spinnerStart();
    this.userService.unfollowUser(this.userId as number, user.id as number).subscribe({
      next: () => {
        this.toast.showSuccess({
          title: 'Success',
          message: `You have unfollowed ${user.userName}.`
        });
        this.followingUsersIdArray = this.followingUsersIdArray.filter(x => x !== user.id);
        this.unfollowUserEventEmitter.emit(user.id as number);
      },
      error: () => {
        this.toast.showError({
          title: 'Error',
          message: `You have already unfollowed ${user.userName}.`
        });
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  isUserFollowed(user: UserDTO): boolean {
    return this.followingUsersIdArray.includes(user.id as number);
  }

}
