import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private messageService: MessageService) { }

  handleError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong, please try again later.',
      life: 3000,
    });
    console.warn(`Error caught by custom err handler: ${error.message}`);
  }
}
