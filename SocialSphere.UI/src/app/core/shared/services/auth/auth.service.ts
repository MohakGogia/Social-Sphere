import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings, SignoutResponse } from 'oidc-client'
import { AppConstants } from '../../../constants/app.constant';
import { CommonService } from '../common/common.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  private loginChangedBehaviourSubject = new BehaviorSubject<boolean>(false);
  loginChanged$ = this.loginChangedBehaviourSubject.asObservable();

  private get identitySettings(): UserManagerSettings {
    return {
      authority: AppConstants.identityAddress,
      client_id: AppConstants.clientId,
      redirect_uri: `${AppConstants.clientRootAddress}/signin-callback`,
      scope: 'openid profile socialSphereAPI',
      response_type: 'code',
      post_logout_redirect_uri: `${AppConstants.clientRootAddress}/signout-callback`
    }
  }

  constructor(private commonService: CommonService) {
    this.userManager = new UserManager(this.identitySettings);
  }

  login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  async finishLogin(): Promise<User> {
    const user = await this.userManager.signinRedirectCallback();
    this.loginChangedBehaviourSubject.next(this.checkIfUserIsAuthenticated(user));
    return user;
  }

  finishLogout(): Promise<SignoutResponse> {
    this.user = null;
    return this.userManager.signoutRedirectCallback();
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.userManager.getUser();
    if (this.user !== user) {
      this.loginChangedBehaviourSubject.next(this.checkIfUserIsAuthenticated(user));
    }
    this.user = user;
    return this.checkIfUserIsAuthenticated(user);
  }

  getAuthToken(): string | null | undefined {
    if (this.checkIfUserIsAuthenticated(this.user)) {
      return this.user?.access_token;
    }
    return null;
  }

  private checkIfUserIsAuthenticated(user: User | null): boolean {
    return !this.commonService.isNullOrUndefined(user) && !user?.expired;
  }

}