import { UserFilterParams } from './../../classes/user-filter-params';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpClientService } from '../http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';
import { UserDTO } from '../../interfaces/user-dto';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedInUser: UserDTO;

  constructor(
    private httpClientService: HttpClientService,
    private configurationService: ConfigurationService,
    private authService: AuthService
  ) { }

  async getLoggedInUser(useCache = true): Promise<UserDTO> {
    if (this.loggedInUser && useCache) {
      return this.loggedInUser;
    }

    const userDetails$ = this.getUserByEmailId(this.authService.getLoggedInUser().email);
    this.loggedInUser = await firstValueFrom(userDetails$);
    return this.loggedInUser;
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/all');
  }

  getActiveUsers(userFilterParams: UserFilterParams): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + `/api/User/active?PageNumber=${userFilterParams.pageNumber}
      &PageSize=${userFilterParams.pageSize}&SearchQuery=${userFilterParams.searchQuery}&OrderBy=${userFilterParams.orderBy}`);
  }

  getMockUsers(countOfFakeUsers: number): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + '/api/User/mock-users?countOfFakeUsers=' + countOfFakeUsers);
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

  followUser(userId: number, followedUserId: number): Observable<boolean> {
    return this.httpClientService.post(`${this.configurationService.apiAddress}/api/User/follow?userId=${userId}&followedUserId=${followedUserId}`, null);
  }

  unfollowUser(userId: number, followedUserId: number): Observable<boolean> {
    return this.httpClientService.post(`${this.configurationService.apiAddress}/api/User/unfollow?userId=${userId}&followedUserId=${followedUserId}`, null);
  }

  getFollowingUsers(userId: number): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + `/api/User/following?userId=${userId}`);
  }

  getFollowers(userId: number): Observable<UserDTO[]> {
    return this.httpClientService.get(this.configurationService.apiAddress + `/api/User/followers?userId=${userId}`);
  }

}
