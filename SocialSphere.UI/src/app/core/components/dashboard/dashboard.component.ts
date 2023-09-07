import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/http-client/http-client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeUsers: any = [];

  constructor(private httpClientService: HttpClientService) { }

  ngOnInit(): void {
    // API call for testing
    this.httpClientService.get('https://localhost:5000/api/User/getMockUsers?countOfFakeUsers=7').subscribe(res => {
      this.activeUsers = res;
    });
  }

}
