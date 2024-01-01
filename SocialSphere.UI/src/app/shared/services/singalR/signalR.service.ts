import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ConfigurationService } from 'src/app/core/services/configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor(private configurationService: ConfigurationService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.configurationService.apiAddress}/chathub`)
      .configureLogging(LogLevel.Debug)
      .build();
  }

  public startConnection(): Promise<void> {
    return this.hubConnection.start();
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection.stop();
  }

  public onReceiveMessage(callback: (user: string, message: string) => void): void {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  public sendMessage(user: string, message: string): Promise<void> {
    return this.hubConnection.invoke('SendMessage', user, message);
  }
}
