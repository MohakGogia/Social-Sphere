import { SignalRService } from './../../services/singalR/signalR.service';
import { UserService } from './../../../core/services/user/user.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

  imgSrc: string;

  @ViewChild('toast') toast: ToastComponent;

  constructor(private userService: UserService,
    public signalRService: SignalRService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,) { }

  ngOnInit(): void {
    this.imgSrc = (this.commonService.isNullOrUndefined(this.user?.profileImageUrl) || this.commonService.isEmpty(this.user?.profileImageUrl))
      ? AppConstants.defaultProfileImgSrc : this.user?.profileImageUrl as string;
  }

  followUser(user: UserDTO) {
    //
  }
}
