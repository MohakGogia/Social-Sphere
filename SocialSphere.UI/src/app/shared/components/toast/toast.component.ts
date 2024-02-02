import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

interface ToastModel {
  title: string;
  message: string;
  position?:
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'
  | 'center';
  life?: number;
}

@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {

  position = 'top-right';

  constructor(
    private messageService: MessageService
  ) {}

  /**
   * This method is used to show Success notification
   * @param toastData holds toast data
   */
  showSuccess(toastData: ToastModel) {
    this.setMetaInfo(toastData);
    this.messageService.add({
      severity: 'success',
      summary: toastData.title,
      detail: toastData.message,
      life: toastData.life,
    });
  }

  /**
   * This method is used to show Info notification
   * @param toastData holds toast data
   */
  showInfo(toastData: ToastModel) {
    this.setMetaInfo(toastData);
    this.messageService.add({
      severity: 'info',
      summary: toastData.title,
      detail: toastData.message,
      life: toastData.life,
    });
  }

  /**
   * This method is used to show warning notification
   * @param toastData holds toast data
   */
  showWaring(toastData: ToastModel) {
    this.setMetaInfo(toastData);
    this.messageService.add({
      severity:'warn',
      summary: toastData.title,
      detail: toastData.message,
      life: toastData.life
    });
  }

  /**
   * This method is used show Error notification
   * @param toastData holds toast data
   */
  showError(toastData: ToastModel) {
    this.setMetaInfo(toastData);
    this.messageService.add({
      severity: 'error',
      summary: toastData.title,
      detail: toastData.message,
      life: toastData.life,
    });
  }

  /**
   * This method is used to show Save notification with default messgae
   */
  showDefaultSaveNotification() {
    this.messageService.add({
      severity: 'success',
      summary: 'Saved successfully',
      detail: 'The data has been saved successfully',
      life: 3000,
    });
  }

  /**
   * This method is used show Error notification with default message
   */
  showDefaultErrorNotification() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong, please try again',
      life: 3000,
    });
  }

  clear() {
    this.messageService.clear();
  }

  private setMetaInfo(toastData: ToastModel) {
    if (toastData.position) {
      this.position = toastData.position;
    }
    if (!toastData.life) {
      toastData.life = 3000;
    }
  }
}
