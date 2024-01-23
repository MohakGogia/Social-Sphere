import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  spinner$: BehaviorSubject<boolean>;

  constructor(public spinnerService: SpinnerService) {
    this.spinner$ = this.spinnerService.spinner$;
  }
}
