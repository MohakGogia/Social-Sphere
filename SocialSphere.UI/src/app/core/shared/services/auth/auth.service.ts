import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings, SignoutResponse } from 'oidc-client';
import { AppConstants } from '../../../constants/app.constant';
import { CommonService } from '../common/common.service';
import { BehaviorSubject } from 'rxjs';
import { Roles } from 'src/app/core/interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userManager: UserManager;
  private user: User | null = null;
  private isAdmin = false;

  private loginChangedBehaviourSubject = new BehaviorSubject<boolean>(false);
  loginChanged$ = this.loginChangedBehaviourSubject.asObservable();

  private get identitySettings(): UserManagerSettings {
    return {
      authority: AppConstants.identityAddress,
      client_id: AppConstants.clientId,
      redirect_uri: `${AppConstants.clientRootAddress}/signin-callback`,
      scope: 'openid profile socialSphereAPI roles',
      response_type: 'code',
      post_logout_redirect_uri: `${AppConstants.clientRootAddress}/signout-callback`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${AppConstants.clientRootAddress}/assets/silent-callback.html`
    };
  }

  constructor(private commonService: CommonService) {
    this.userManager = new UserManager(this.identitySettings);
    this.userManager.events.addAccessTokenExpired(_ => {
      this.loginChangedBehaviourSubject.next(false);
    });
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
    this.loginChangedBehaviourSubject.next(false);
    return this.userManager.signoutRedirectCallback();
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.userManager.getUser();
    if (this.user !== user) {
      this.loginChangedBehaviourSubject.next(this.checkIfUserIsAuthenticated(user));
    }
    this.user = user;
    this.setUserRole();
    return this.checkIfUserIsAuthenticated(user);
  }

  getAuthToken(): string | null | undefined {
    if (this.checkIfUserIsAuthenticated(this.user)) {
      return this.user?.access_token;
    }
    return null;
  }

  isAdministrator(): boolean {
    return this.isAdmin;
  }

  getLoggedInUser(): User | null{
    return this.user;
  }

  private checkIfUserIsAuthenticated(user: User | null): boolean {
    return !this.commonService.isNullOrUndefined(user) && !user?.expired;
  }

  private setUserRole(): void {
    this.isAdmin = (this.user?.profile['role'] === Roles.Admin);
  }

}
