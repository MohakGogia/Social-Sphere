import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActionType, ColumnHeader } from 'src/app/core/interfaces/column-header';
import { HeaderFieldType } from 'src/app/core/interfaces/enums';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {

  rowsPerPageOptions = [5, 10, 20];

  @Input() columnHeaders: ColumnHeader[];
  @Input() activeSort = '';
  @Input() sortDirection = 1;
  @Input() first = 0;
  @Input() pageSize: number;
  @Input() totalRecords = 0;
  @Input() paginatorLoading = false;
  @Input() tableData: any[] = [];
  @Input() emptyTableMessage = '';
  @Input() showPaginator = false;
  @Input() resizableColumns = true;
  @Input() showCurrentPageReport = true;
  @Input() widthType: '%' | 'px' = '%';

  @Output() deleteClick = new EventEmitter<any>();

  @ViewChild('dt', { static: true }) table: Table;

  get headerFieldType() {
    return HeaderFieldType;
  }

  get actionType() {
    return ActionType;
  }

  getCellData(rowData: any, col: any) {
    return rowData[col.field];
  }

  onDelete(rowData: any) {
    this.deleteClick.emit(rowData);
  }

  pageChange(event: any) {
    this.first = event.first;
    this.pageSize = event.rows;
  }

}
