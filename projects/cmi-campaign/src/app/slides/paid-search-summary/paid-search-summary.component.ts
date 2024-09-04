import { Component } from '@angular/core';

@Component({
  selector: 'paid-search-summary',
  templateUrl: './paid-search-summary.component.html',
  styleUrl: './paid-search-summary.component.less'
})
export class PaidSearchSummaryComponent {
  isConditionTrue: boolean = false;
  violetHeader = true;
  evenRowVioletColor: boolean = true;
  oddRowVioletColor: boolean = true;
  
}
