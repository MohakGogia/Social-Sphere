import { Injectable } from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpClientService } from '../http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';
import { UserDTO } from '../../interfaces/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClientService: HttpClientService,
    private configurationService: ConfigurationService,
  ) { }

  getActiveUsers(): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/active');
  }
}
