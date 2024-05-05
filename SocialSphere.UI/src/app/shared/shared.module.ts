import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../primeNg.module';
import { ToastComponent } from './components/toast/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/timeAgo.pipe';
import { DataTableComponent } from './components/data-table/data-table.component';

@NgModule({
  declarations: [
    ToastComponent,
    SpinnerComponent,
    TimeAgoPipe,
    DataTableComponent
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
    TimeAgoPipe,
    DataTableComponent
  ],
  providers: []
})
export class SharedModule { }
