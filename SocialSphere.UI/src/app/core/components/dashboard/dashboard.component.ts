import { AuthService } from './../../shared/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/http-client/http-client.service';
import { ConfigurationService } from '../../services/configuration/configuration.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeUsers: any = [];
  isAdmin = false;
  user: any;

  constructor(
    private httpClientService: HttpClientService,
    private authService: AuthService,
    private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    // API call for testing
    this.httpClientService.get(`${this.configurationService.apiAddress}/api/User/getMockUsers?countOfFakeUsers=7`).subscribe(res => {
      this.activeUsers = res;
    });
    this.isAdmin = this.authService.isAdministrator();
    this.user = this.authService.getLoggedInUser();
  }

}
