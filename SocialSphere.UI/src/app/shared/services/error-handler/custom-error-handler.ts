import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private messageService: MessageService) { }

  handleError(error: any): void {
    if (error?.code === -100) return;

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong, please try again.',
      life: 3000,
    });
    console.warn(`Error caught by custom err handler: ${error.message}`);
  }
}
