/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  get(url: string, httpParams?: HttpParams): Observable<any> {
    return this.http.get<any>(url, { headers: this.getHeaders(), params: httpParams });
  }

  post(url: string, data: any, httpParams?: HttpParams): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(url, body, { headers: this.getHeaders(), params: httpParams });
  }

  put(url: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(url, body, { headers: this.getHeaders() });
  }

  patch(url: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch<any>(url, body, { headers: this.getHeaders() });
  }

  delete(url: string): Observable<any> {
    return this.http.delete<any>(url, { headers: this.getHeaders() });
  }

  private getHeaders() {
    let headers = new HttpHeaders();
    const authToken = this.getAuthToken();
    const bearerToken = `Bearer ${authToken}`;

    headers = headers.set('Authorization', bearerToken);
    headers = headers.set('Content-Type', 'application/json');

    return headers;
  }

  private getAuthToken() {
    return this.authService.getAuthToken();
  }

}
