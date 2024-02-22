import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user-model';
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeUsers: any = [];
  isAdmin = false;
  user: User | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdministrator();
    this.user = this.authService.getLoggedInUser();
    if (this.isAdmin) {
      this.getMockUsers();
    }
  }

  getMockUsers() {
    this.userService.getMockUsers(7).subscribe({
      next: (res) => {
        this.activeUsers = res;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
