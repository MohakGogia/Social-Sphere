import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
//import { Workbook } from 'exceljs';
import * as Excel from 'exceljs/dist/exceljs.min.js'

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


  exportToExcel() {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add some data to the worksheet
    worksheet.addRow(['Name', 'Age', 'Country']);
    worksheet.addRow(['John', 30, 'USA']);
    worksheet.addRow(['Alice', 25, 'Canada']);
    worksheet.addRow(['Bob', 35, 'UK']);

    // Set column headers bold
    worksheet.getRow(1).font = { bold: true };

    // Generate the Excel file and download it
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }
}
