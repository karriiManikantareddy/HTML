import { Component, input, Input } from "@angular/core";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.css",
})
export class TableComponent {
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
