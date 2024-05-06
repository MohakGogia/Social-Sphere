import { Component, OnInit, ViewChild } from '@angular/core';
import { SignalRService } from 'src/app/shared/services/singalR/signalR.service';
import { FilterType, HeaderFieldType, MessageType } from '../core/interfaces/enums';
import { UserService } from '../core/services/user/user.service';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { UserDTO } from '../core/interfaces/user-dto';
import { Message } from '../core/interfaces/message';
import { ActionType, ColumnHeader, SortDirection } from '../core/interfaces/column-header';
import { AppConstants } from '../core/constants/app.constant';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {
  selectedMessageType: MessageType = MessageType.Unread;
  messageType = MessageType;
  loggedInUser: UserDTO;
  messages: any[] = [];
  cols: ColumnHeader[] = [];
  pageSize: number = AppConstants.defaultPaginationSize;
  activeSort = '';
  sortDirection = SortDirection.Descending;

  @ViewChild('toast') toast: ToastComponent;

  constructor(private signalRService: SignalRService,
    private spinnerService: SpinnerService,
    private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.activeSort = 'messageSent';
    this.sortDirection = SortDirection.Descending;
    this.setColumnHeaders();
    this.spinnerService.spinnerStart();
    this.loggedInUser = await this.userService.getLoggedInUser();
    this.spinnerService.spinnerTimeOut();
    this.fetchMessagesData();
  }

  onMessageCategoryChange(type: MessageType) {
    this.selectedMessageType = type;
    this.setColumnHeaders();
    this.fetchMessagesData();
  }

  onDelete($event: Message) {
   this.deleteMessage($event.id);
   this.messages = this.messages.filter(x => x.id !== $event.id);
  }

  private fetchMessagesData() {
    this.spinnerService.spinnerStart();
    this.signalRService.getMessagesForUser(this.loggedInUser?.userName, this.selectedMessageType).subscribe({
      next: (result: Message[]) => {
        this.messages = result;
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  private deleteMessage(id: number) {
    this.spinnerService.spinnerStart();
    this.signalRService.deleteMessage(id, this.loggedInUser?.userName).subscribe({
      next: () => {
        this.toast.showSuccess({
          title: 'Success',
          message: `Message Deleted Successfully.`
        });
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
        this.toast.showDefaultErrorNotification();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  private setColumnHeaders() {
    let userHeaderField = 'Sender Username';

    if (this.selectedMessageType === MessageType.Outbox) {
      userHeaderField = 'Receiver Username';
    }

    this.cols = [
      { width: '30', field: 'content', header: 'Message', sort: true, filter: false, filterType: FilterType.Text, headerFieldType: HeaderFieldType.Text },
      { width: '12', field: `${this.selectedMessageType === MessageType.Outbox ? 'recipientUsername' : 'senderUsername'}`, header: userHeaderField, sort: true, filter: false, filterType: FilterType.Text, headerFieldType: HeaderFieldType.Text },
      { width: '18', field: 'messageSent', header: 'Message Sent Date', sort: true, filter: false, filterType: FilterType.Date, headerFieldType: HeaderFieldType.DateTime },
      { width: '6', field: '', header: 'Review', sort: false, filter: false, filterType: FilterType.None, headerFieldType: HeaderFieldType.Action,
        actions: [ {type: ActionType.Delete, tooltip: 'Delete Message'} ]
       },
    ];
  }
}
