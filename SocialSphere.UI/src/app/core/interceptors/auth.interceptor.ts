import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken();
    const bearerToken = `Bearer ${authToken}`;

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', bearerToken);

    if (req.url.includes('Image/add-photo')) {
      const modifiedRequest = req.clone({ headers });
      return next.handle(modifiedRequest);
    }

    headers = headers.set('Content-Type', 'application/json');
    const authRequest = req.clone({ headers });

    return next.handle(authRequest);
  }
}
