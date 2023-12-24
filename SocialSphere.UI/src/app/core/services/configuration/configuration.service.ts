import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IServerConfiguration {
  ApiAddress: string;
  IdentityServerAddress: string;
  AppAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private configuration!: IServerConfiguration;

  loadConfig() {
    this.configuration = {
      ApiAddress: environment.apiAddress,
      IdentityServerAddress: environment.identityServerAddress,
      AppAddress: environment.appAddress,
    };
    localStorage.setItem('env', environment.env_variable);
  }

  get apiAddress() {
    return this.configuration.ApiAddress;
  }

  get identityServerAddress() {
    return this.configuration.IdentityServerAddress;
  }

  get appAddress() {
    return this.configuration.AppAddress;
  }
}

