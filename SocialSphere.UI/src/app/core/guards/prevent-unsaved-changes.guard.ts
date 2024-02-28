import { CanDeactivateFn } from '@angular/router';
import { EditProfileComponent } from 'src/app/edit-profile/edit-profile.component';
import { ConfirmationService } from 'primeng/api';
import { inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export const PreventUnsavedChangesGuard: CanDeactivateFn<EditProfileComponent> = (component) : Observable<boolean> | boolean => {
  const confirmationService = inject(ConfirmationService);

  if (component.userDetailsForm?.dirty) {
    return new Observable<boolean>((observer) => {
      confirmationService.confirm({
        message: 'You have some unsaved changes. Are you sure you want to leave?',
        header: 'Confirmation Required',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-danger",
        acceptButtonStyleClass: "p-button-text",
        closeOnEscape: true,
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  return true;
};
