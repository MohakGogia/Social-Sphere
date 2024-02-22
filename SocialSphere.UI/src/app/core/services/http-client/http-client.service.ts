/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) { }

  get(url: string, httpParams?: HttpParams): Observable<any> {
    return this.http.get<any>(url, { params: httpParams });
  }

  post(url: string, data: any, httpParams?: HttpParams): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(url, body, { params: httpParams });
  }

  put(url: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.put<any>(url, body, {});
  }

  patch(url: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch<any>(url, body, {});
  }

  delete(url: string): Observable<any> {
    return this.http.delete<any>(url, {});
  }

  sendMediaContent(url: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(url, formData);
  }

}
