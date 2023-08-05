import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5000/chathub')
      .configureLogging(LogLevel.Debug)
      .build();
  }

  public startConnection(): Promise<void> {
    var test = 'ss';
    console.log(test)
    return this.hubConnection.start();
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection.stop();;
  }

  public onReceiveMessage(callback: (user: string, message: string) => void): void {
    const x = 'ds'
    if ('sas' == x) {

    }
    this.hubConnection.on('ReceiveMessage', callback);
  }

  public sendMessage(user: string, message: string): Promise<void> {
    return this.hubConnection.invoke('SendMessage', user, message);
  }
}
