import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user/user.service';
import { UserDTO } from '../core/interfaces/user-dto';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { UserFilterParams } from '../core/classes/user-filter-params';
import { AuthService } from '../shared/services/auth/auth.service';
import { User } from 'src/app/core/models/user-model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {
  users: UserDTO[] = [];
  searchQuery = '';
  first = 1;
  rows = 10;
  sortBy: 'lastActive' | 'newestMembers' = 'lastActive';
  paginationOptions = [10, 20, 30];
  searchFilters: UserFilterParams;
  loggedInUser: User;

  constructor(
    private userService: UserService,
    private spinnerService: SpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.initializeFilterParams();
    this.spinnerService.spinnerStart();
    this.userService.getActiveUsers(this.searchFilters).subscribe({
      next: (result: UserDTO[]) => {
        this.users = result.filter(x => x.email !== this.loggedInUser.email);
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.first = event.first + 1;
    this.rows = event.rows;
    this.searchFilters.pageNumber = this.first;
    this.searchFilters.pageSize = this.rows;
    this.onSearch();
  }

  onSearch() {
    this.searchFilters.searchQuery = this.searchQuery;
    this.spinnerService.spinnerStart();
    this.userService.getActiveUsers(this.searchFilters).subscribe({
      next: (result: UserDTO[]) => {
        this.users = result.filter(x => x.email !== this.loggedInUser.email);
      },
      error: () => {
        this.spinnerService.spinnerTimeOut();
      },
      complete: () => {
        this.spinnerService.spinnerTimeOut();
      }
    });
  }

  resetFilters() {
    this.initializeFilterParams();
    this.onSearch();
  }

  onSortingChange(sortColumn: string) {
    this.sortBy = (sortColumn === 'lastActive' ? 'lastActive' : 'newestMembers');
    this.searchFilters.orderBy = sortColumn;
    this.onSearch();
  }

  private initializeFilterParams() {
    this.first = 1;
    this.rows = 10;
    this.sortBy = 'lastActive';
    this.searchQuery = '';
    this.searchFilters = new UserFilterParams();
  }
}
