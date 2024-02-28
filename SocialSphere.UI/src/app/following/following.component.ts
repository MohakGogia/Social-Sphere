import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user/user.service';
import { UserDTO } from 'src/app/core/interfaces/user-dto';
import { SpinnerService } from '../shared/services/spinner/spinner.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  followingUsers: UserDTO[] = [];
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
    this.loggedInUser = await this.userService.getLoggedInUser();
    this.spinnerService.spinnerTimeOut();
    this.fetchFollowingUsersData();
    this.followedByUsersIdArray = this.loggedInUser?.followedByUserIds as number[] ?? [];
    this.followingUsersIdArray = this.loggedInUser?.followedUserIds as number[] ?? [];
  }

  onPageChange(event: PageEvent) {
    this.first = event.first + 1;
    this.rows = event.rows;
  }

  private fetchFollowingUsersData() {
    this.spinnerService.spinnerStart();
    this.userService.getFollowingUsers(this.loggedInUser?.id as number).subscribe({
      next: (result: UserDTO[]) => {
        this.followingUsers = result;
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  async updateFollowingUserList(event: number) {
    this.followingUsers = this.followingUsers.filter(x => x.id !== event);
  }

}
