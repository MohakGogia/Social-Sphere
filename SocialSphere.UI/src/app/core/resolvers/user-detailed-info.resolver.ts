import { UserService } from '../services/user/user.service';
import { UserDTO } from '../interfaces/user-dto';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';

export const UserDetailedInfoResolver: ResolveFn<UserDTO> = (route) : Observable<UserDTO>=> {
  const userName = route.paramMap.get('username');
  const userService = inject(UserService);

  return userService.getUserByUserName(userName as string);
};
