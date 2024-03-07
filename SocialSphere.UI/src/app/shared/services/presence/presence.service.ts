import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/core/services/configuration/configuration.service';
import { MessageService } from 'primeng/api';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private configurationService: ConfigurationService,
    private messageService: MessageService) { }

  createHubConnection(userName: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.configurationService.apiAddress}/hubs/presence?userName=${userName}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', (userName: string) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (userNames: string[]) => this.onlineUsersSource.next([...userNames, userName])
      });
    })

    this.hubConnection.on('UserIsOffline', (userName: string) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (userNames: string[]) => this.onlineUsersSource.next([...userNames.filter(x => x !== userName)])
      });
    })

    this.hubConnection.on('GetOnlineUsers', (userNames: string[]) => {
      this.onlineUsersSource.next(userNames);
    })

    this.hubConnection.on('NewMessageReceived', (userName: string) => {
      this.messageService.add({
        severity: 'info',
        summary: 'New Message',
        detail: `${userName} has sent you a new message! Go to the messages tab to see it!`,
        sticky: true,
        closable: true,
        life: 3000
      });
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
