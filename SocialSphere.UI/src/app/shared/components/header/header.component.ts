import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from 'src/app/core/models/user-model';
import { MenuItem } from 'primeng/api/menuitem';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  user: User | undefined;
  menuItems!: MenuItem[];

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
    this.router.navigateByUrl('/profile');
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
        this.messageService.add({ severity: 'success', detail: 'Logout successful!' });
        setTimeout(() => {
          this.authService.logout();
        }, 1000);
      }
  });
  }
}
