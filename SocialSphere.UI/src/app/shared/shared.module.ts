import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../primeNg.module';
import { ToastComponent } from './components/toast/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/timeago.pipe';

@NgModule({
  declarations: [
    ToastComponent,
    SpinnerComponent,
    TimeAgoPipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    ToastComponent,
    SpinnerComponent,
    TimeAgoPipe
  ],
  providers: []
})
export class SharedModule { }
