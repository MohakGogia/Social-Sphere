import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signalR.service';

interface ChatMessage {
  user: string;
  message: string;
  date: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, OnDestroy {

  user = '';
  message = '';
  chatMessages: ChatMessage[] = [];

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection()
      .then(() => {
        console.log('SignalR connection started.');
      })
      .catch((error) => {
        console.error('Error starting SignalR connection:', error);
      });

    this.signalRService.onReceiveMessage((user, message) => {
      this.chatMessages.push({ user, message, date: new Date()});
    });
  }

  public sendMessage(): void {
    this.signalRService.sendMessage(this.user, this.message)
      .then(() => {
        this.message = '';
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
  }

}
