import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Commented the code for now since httpClient service is already handling all this.
    // This was just a practical hands-on for interceptors

    // const authToken = this.authService.getAuthToken();
    // const bearerToken = `Bearer ${authToken}`;
    // let headers = new HttpHeaders();

    // headers = headers.set('Authorization', bearerToken);
    // headers = headers.set('Content-Type', 'application/json');

    // const authRequest = req.clone({ headers });
    // return next.handle(authRequest);

    return next.handle(req);
  }

}
