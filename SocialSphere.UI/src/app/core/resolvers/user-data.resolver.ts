import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { UserDTO } from '../interfaces/user-dto';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';

export const userDataResovler: ResolveFn<UserDTO> = () : Observable<UserDTO> => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const userEmail = authService.getLoggedInUser().email;

  return userService.getUserByEmailId(userEmail);
};
