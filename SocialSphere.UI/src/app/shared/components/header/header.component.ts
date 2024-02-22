import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from 'src/app/core/models/user-model';
import { MenuItem } from 'primeng/api/menuitem';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ConfirmationService]
})

export class HeaderComponent implements OnInit {
  user: User | undefined;
  menuItems!: MenuItem[];

  @ViewChild('toast') toast!: ToastComponent;

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.menuItems = [
      {
        label: `Welcome ${this.user?.userName}`,
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Edit Profile',
            icon: 'pi pi-fw pi-user-edit',
            command: () => {
              this.navigateToEditProfile();
            }
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
              this.logout();
            }
          },
        ]
      }
    ]
  }

  navigateToEditProfile() {
    this.router.navigateByUrl('/edit-profile');
  }

  logout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass: "p-button-text",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.toast.showSuccess({
          title: '',
          message: 'Logout successful!'
        });
        setTimeout(() => {
          this.authService.logout();
        }, 1000);
      }
    });
  }
}
