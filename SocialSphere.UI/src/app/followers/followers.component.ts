import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../core/interfaces/user-dto';
import { UserService } from '../core/services/user/user.service';
import { SpinnerService } from '../shared/services/spinner/spinner.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
  followerUsers: UserDTO[] = [];
  loggedInUser: UserDTO;
  first = 1;
  rows = 10;
  paginationOptions = [10, 20, 30];
  followingUsersIdArray: number[] = [];
  followedByUsersIdArray: number[] = [];

  constructor(private userService: UserService,
    private spinnerService: SpinnerService) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.spinnerStart();
    this.loggedInUser = await this.userService.getLoggedInUser(false);
    this.spinnerService.spinnerTimeOut();
    this.fetchFollowersData();
    this.followedByUsersIdArray = this.loggedInUser?.followedByUserIds as number[] ?? [];
    this.followingUsersIdArray = this.loggedInUser?.followedUserIds as number[] ?? [];
  }

  onPageChange(event: PageEvent) {
    this.first = event.first + 1;
    this.rows = event.rows;
  }

  private fetchFollowersData() {
    this.spinnerService.spinnerStart();
    this.userService.getFollowers(this.loggedInUser?.id as number).subscribe({
      next: (result: UserDTO[]) => {
        this.followerUsers = result;
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

}
