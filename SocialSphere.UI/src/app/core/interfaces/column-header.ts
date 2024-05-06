import { SelectItem } from 'primeng/api';
import { HeaderFieldType } from 'src/app/core/interfaces/enums';
import { FilterType } from './enums';

export interface ColumnHeader {
  width: string;
  field: string;
  header: string;
  sort: boolean;
  filter: boolean;
  filterType: FilterType;
  filterData?: SelectItem[];
  filterValue?: any;
  comparatorValue?: any;
  headerFieldType: HeaderFieldType;
  columnHeading?: string;
  columnAlignment?: 'right' | 'left' | 'center';
  tooltip?: string;
  actions?: Actions[];
}

export interface Actions {
  tooltip?: string;
  type: ActionType;
}

export enum ActionType {
  Delete,
  Select
}

export enum SortDirection {
  Ascending = 1,
  Descending = -1
}
