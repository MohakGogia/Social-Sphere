import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenubarModule } from 'primeng/menubar';

@NgModule({
  imports: [
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    ToastModule,
    FileUploadModule,
    ImageModule,
    AvatarModule,
    SkeletonModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    MenubarModule,
    ConfirmDialogModule,
  ],
  exports: [
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    ToastModule,
    FileUploadModule,
    ImageModule,
    AvatarModule,
    SkeletonModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    MenubarModule,
    ConfirmDialogModule,
  ],
  providers: [
  ],
})
export class PrimeNgModule {}
