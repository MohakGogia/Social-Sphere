import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dictionary } from './core/interfaces/dictionary';
import { AuthService } from './shared/services/auth/auth.service';
import { CommonService } from './shared/services/common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Social-Sphere';
  isUserAuthenticated = false;
  subscriptions: Dictionary<Subscription> = {};

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    ) {}

  ngOnInit(): void {
    const userAuthSub = this.authService.loginChanged$.subscribe((isUserAuthenticated: boolean) => {
      this.isUserAuthenticated = isUserAuthenticated;
    });
    this.commonService.subscribeToASubcription(this.subscriptions, 'UserAuthSub', userAuthSub);
  }

  ngOnDestroy(): void {
    this.commonService.unsubscribeSubcriptions(this.subscriptions);
  }

}
