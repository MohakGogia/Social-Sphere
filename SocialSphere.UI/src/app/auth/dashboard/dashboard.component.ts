import { AuthService } from './../../shared/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client/http-client.service';
import { ConfigurationService } from '../../core/services/configuration/configuration.service';
import { User } from 'src/app/core/models/user-model';

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
    private httpClientService: HttpClientService,
    private authService: AuthService,
    private configurationService: ConfigurationService,
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdministrator();
    this.user = this.authService.getLoggedInUser();
    if (this.isAdmin) {
      this.getMockUsers();
    }
  }

  getMockUsers() {
    // API call for testing
    this.httpClientService.get(`${this.configurationService.apiAddress}/api/User/getMockUsers?countOfFakeUsers=7`).subscribe({
      next: (res) => {
        this.activeUsers = res;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
