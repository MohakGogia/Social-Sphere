import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignalRService } from '../shared/services/singalR/signalR.service';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss']
})
export class UserMessagesComponent {

  messageContent = '';
  isLoading = false;

  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('toast') toast: ToastComponent;
  @Input() loggedInUserName: string;
  @Input() userName: string;

  constructor(public signalRSerice: SignalRService) { }

  sendMessage() {
    this.isLoading = true;
    this.signalRSerice.sendMessage(this.loggedInUserName, this.userName, this.messageContent)
    .then(() => this.messageForm.reset())
    .catch(() => this.toast.showDefaultErrorNotification())
    .finally(() => this.isLoading = false);
  }
}
