import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    // PrimeNgModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // PrimeNgModule
  ],
  providers: []
})
export class SharedModule { }
