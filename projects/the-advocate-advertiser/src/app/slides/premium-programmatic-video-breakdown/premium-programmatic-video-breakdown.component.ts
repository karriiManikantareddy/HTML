import { Component } from '@angular/core';
import {combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';

@Component({
  selector: 'premium-programmatic-video-breakdown',
  templateUrl: './premium-programmatic-video-breakdown.component.html',
})
export class PremiumProgrammaticVideoBreakdownComponent {
  loading: boolean = true;
  creativeGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.programmaticVideoTotals(),
      dataService.programmaticVideoBreakdownItems(),
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
