import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService) { }

  async canActivate(): Promise<boolean> {
    if (await this.authService.isAuthenticated()) {
        return true;
      }
    else {
      this.authService.login();
      return false;
    }
  }
}
