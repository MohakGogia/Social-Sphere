import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
