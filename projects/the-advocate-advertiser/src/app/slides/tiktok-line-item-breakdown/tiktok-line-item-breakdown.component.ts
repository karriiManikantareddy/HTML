import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';

@Component({
  selector: 'tiktok-line-item-breakdown',
  templateUrl: './tiktok-line-item-breakdown.component.html',
})
export class TiktokLineItemBreakdownComponent {
  loading: boolean = true;
  lineItemGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'conversion'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.tiktokDisplayTotals(),
      dataService.tiktokDisplayLineItemBreakdownItems(),
    ]).subscribe(([totals, lineItems]) => {
      this.loading = false;
      this.totals = totals;
      this.lineItemGroups = lineItems
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    });
  }
  
}
