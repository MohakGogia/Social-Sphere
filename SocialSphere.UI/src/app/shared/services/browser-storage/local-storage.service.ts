import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  getValue(key: string) {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  setValue(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
   }

   clearValue(key: string) {
    localStorage.removeItem(key);
   }

   clear() {
    localStorage.clear();
   }
}
