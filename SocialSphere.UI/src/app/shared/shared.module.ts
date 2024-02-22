import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../primeNg.module';
import { ToastComponent } from './components/toast/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ToastComponent,
    SpinnerComponent
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
    SpinnerComponent
  ],
  providers: []
})
export class SharedModule { }
