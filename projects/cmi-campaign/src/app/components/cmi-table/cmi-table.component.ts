import { Component, Input } from '@angular/core';

@Component({
  selector: 'cmi-table',
  templateUrl: './cmi-table.component.html',
  styleUrl: './cmi-table.component.less'
})
export class CmiTableComponent {
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Input() isConditionTrue: boolean = false;
  @Input() blueHeader: boolean = false;
  @Input() violetHeader: boolean = false;
  @Input() evenRowBlueColor: boolean = false;
  @Input() oddRowBlueColor: boolean = false;
  @Input() evenRowVioletColor: boolean = false;
  @Input() oddRowVioletColor: boolean = false;
}
