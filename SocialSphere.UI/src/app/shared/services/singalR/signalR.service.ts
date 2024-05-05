import { SpinnerService } from './../spinner/spinner.service';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Group } from 'src/app/core/interfaces/group';
import { Message } from 'src/app/core/interfaces/message';
import { ConfigurationService } from 'src/app/core/services/configuration/configuration.service';
import { HttpClientService } from 'src/app/core/services/http-client/http-client.service';
import { MessageService } from 'primeng/api';
import { MessageType } from 'src/app/core/interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection?: HubConnection;
  private messageThreadSouce = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSouce.asObservable();

  constructor(private configurationService: ConfigurationService,
    private spinnerService: SpinnerService,
    private httpClientService: HttpClientService,
    private messageService: MessageService) { }

  createHubConnection(senderUsername: string, recipientUserName: string) {
    this.spinnerService.spinnerStart();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.configurationService.apiAddress}/hubs/message?sender=${senderUsername}&receiver=${recipientUserName}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build();

    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(() => {
        console.log('Connection started');
        this.spinnerService.spinnerTimeOut();
      });

    this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
      this.messageThreadSouce.next(messages);
    })

    this.hubConnection.on('NewMessage', (message: Message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages: Message[]) => {
          this.messageThreadSouce.next([...messages, message]);
        }
      })
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.userName === recipientUserName)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages: Message[]) => {
            messages.forEach(message => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            })
            this.messageThreadSouce.next([...messages]);
          }
        })
      }
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSouce.next([]);
      this.hubConnection?.stop().catch(error => console.log(error));
    }
  }

  async sendMessage(senderUsername: string, recipientUsername: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', { senderUsername, recipientUsername, content })
      .catch(error => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error?.message}`,
          life: 3000
        });
      });
  }

  getMessagesForUser(userName: string, messageType: MessageType): Observable<Message[]> {
    return this.httpClientService.get(`${this.configurationService.apiAddress}/api/Message?userName=${userName}&messageType=${messageType}`);
  }

  deleteMessage(id: number, userName: string) {
    return this.httpClientService.delete(`${this.configurationService.apiAddress}/api/Message?id=${id}&userName=${userName}`);
  }

}
