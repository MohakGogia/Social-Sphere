import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-redirect-callback',
  template: '<div></div>'
})
export class SigninRedirectCallbackComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.authService.finishLogin();
    this.router.navigate(['/'], { replaceUrl: true });
  }

}
