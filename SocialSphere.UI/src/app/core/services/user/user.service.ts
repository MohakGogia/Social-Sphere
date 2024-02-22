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

  getAllUsers(): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/all');
  }

  getActiveUsers(): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/active');
  }

  getMockUsers(countOfFakeUsers: number): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/mock-users' + countOfFakeUsers);
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/' + id);
  }

  getUserByEmailId(emailId: string): Observable<UserDTO> {
    return this.httpClientService.get(this.configurationService.apiAddress + `/api/User/email/${emailId}`);
  }

  saveUser(user: UserDTO): Observable<UserDTO> {
    return this.httpClientService.post(this.configurationService.apiAddress + '/api/User', user);
  }

}
