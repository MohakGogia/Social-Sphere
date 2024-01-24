import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinner$ = new BehaviorSubject(false);

  spinnerStart() {
    this.spinner$.next(true);
  }

  spinnerTimeOut(timeOut = 100) {
    setTimeout(() => {
      this.spinner$.next(false);
    }, timeOut);
  }
}
