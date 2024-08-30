import { Component } from '@angular/core';
import {combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';

@Component({
  selector: 'tiktok-breakdown',
  templateUrl: './tiktok-breakdown.component.html',
})
export class TiktokBreakdownComponent {
  loading: boolean = true;
  creativeGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'conversion'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.tiktokDisplayTotals(),
      dataService.tiktokBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
        this.loading = false;
        this.totals = totals;
        this.creativeGroups = creatives
          .sortBy(c => -c.metrics.impressions.value)
          .inGroupsOf(10)
          .map('compact');
      });
  }

}
