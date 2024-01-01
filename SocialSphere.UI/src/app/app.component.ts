import { CommonService } from './core/shared/services/common/common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './core/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Dictionary } from './core/interfaces/dictionary';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Social-Sphere';
  isUserAuthenticated = false;
  subscriptions: Dictionary<Subscription> = {};

  constructor(private authService: AuthService, private commonService: CommonService) {
  }

  ngOnInit(): void {
  const userAuthSub  = this.authService.loginChanged$.subscribe((isUserAuthenticated: boolean) => {
    this.isUserAuthenticated = isUserAuthenticated;
  });
  this.commonService.subscribeToASubcription(this.subscriptions, 'UserAuthSub', userAuthSub);
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.commonService.unsubscribeSubcriptions(this.subscriptions);
  }

}
