import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';

@Component({
  selector: 'amazon-display-line-item-breakdown',
  templateUrl: './amazon-display-line-item-breakdown.component.html',
})
export class AmazonDisplayLineItemBreakdownComponent {
  loading: boolean = true;
  lineItemGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.amazonDisplayTotals(),
      dataService.amazonDisplayLineItemBreakdownItems(),
    ]).subscribe(([totals, lineItems]) => {
      this.loading = false;
      this.totals = totals;
      this.lineItemGroups = lineItems
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact');
    });
  }

}
