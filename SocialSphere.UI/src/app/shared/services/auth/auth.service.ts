import { LocalStorageService } from './../browser-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings, SignoutResponse } from 'oidc-client';
import { CommonService } from '../common/common.service';
import { BehaviorSubject } from 'rxjs';
import { Roles } from 'src/app/core/interfaces/enums';
import { ConfigurationService } from 'src/app/core/services/configuration/configuration.service';
import { AppConstants } from 'src/app/core/constants/app.constant';
import { User as UserDTO } from 'src/app/core/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userManager: UserManager;
  private user: User | null = null;
  private isAdmin = false;

  public userDTO: UserDTO;

  private loginChangedBehaviourSubject = new BehaviorSubject<boolean>(false);
  loginChanged$ = this.loginChangedBehaviourSubject.asObservable();

  private get identitySettings(): UserManagerSettings {
    return {
      authority: this.configurationService.identityServerAddress,
      client_id: AppConstants.clientId,
      redirect_uri: `${this.configurationService.appAddress}/signin-callback`,
      scope: 'openid profile socialSphereAPI roles',
      response_type: 'code',
      post_logout_redirect_uri: `${this.configurationService.appAddress}/signout-callback`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${this.configurationService.appAddress}/assets/silent-callback.html`
    };
  }

  constructor(private commonService: CommonService, private configurationService: ConfigurationService, private localStorageService: LocalStorageService) {
    this.userManager = new UserManager(this.identitySettings);
    this.userManager.events.addAccessTokenExpired(_ => {
      this.loginChangedBehaviourSubject.next(false);
    });
  }

  login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  logout() {
    return this.userManager.signoutRedirect();
  }

  finishLogout(): Promise<SignoutResponse> {
    this.user = null;
    this.loginChangedBehaviourSubject.next(false);
    return this.userManager.signoutRedirectCallback();
  }

  async finishLogin(): Promise<User> {
    const user = await this.userManager.signinRedirectCallback();
    await this.setUserOnAuthentication(user);
    this.loginChangedBehaviourSubject.next(true);
    return user;
  }

  async setUserOnAuthentication(user: User): Promise<void> {
    this.user = user;
    this.localStorageService.setValue('token', this.user?.access_token);
    this.setUserRole();
    this.userDTO = {
      userName: this.user.profile['name'] as string,
      email: this.user.profile['email'] as string,
      role: this.user.profile['role'] as Roles,
      photoUrl: ''
    };
  }

  getAuthToken(): string | null | undefined {
    if (this.checkIfUserIsAuthenticated()) {
      return this.user?.access_token;
    }
    return null;
  }

  isAdministrator(): boolean {
    return this.isAdmin;
  }

  getLoggedInUser(): UserDTO {
    return this.userDTO;
  }

  checkIfUserIsAuthenticated(): boolean {
    const token = this.localStorageService.getValue('token')?.trim();
    if (this.commonService.isNullOrUndefined(token) || this.commonService.isEmpty(token)) {
      return false;
    }
    return !this.commonService.isNullOrUndefined(this.user) && !this.user?.expired;
  }

  private setUserRole(): void {
    this.isAdmin = (this.user?.profile['role'] === Roles.Admin);
  }

}
