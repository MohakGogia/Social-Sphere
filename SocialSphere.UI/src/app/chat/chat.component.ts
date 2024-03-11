import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/shared/services/singalR/signalR.service';

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

export class ChatComponent {
  user = '';
  message = '';
  chatMessages: ChatMessage[] = [];

  constructor(private signalRService: SignalRService) {}

}
