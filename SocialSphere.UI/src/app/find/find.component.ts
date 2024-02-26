import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user/user.service';
import { UserDTO } from '../core/interfaces/user-dto';
import { SpinnerService } from '../shared/services/spinner/spinner.service';

@Component({
  selector: 'find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {
  users: UserDTO[] = [];

  constructor(
    private userService: UserService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.spinnerStart();
    this.userService.getActiveUsers().subscribe((res: UserDTO[]) => {
      this.users = res;
    });
    this.spinnerService.spinnerTimeOut();
  }

}
