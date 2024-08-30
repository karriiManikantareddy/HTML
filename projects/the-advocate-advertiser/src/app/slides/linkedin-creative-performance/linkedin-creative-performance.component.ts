import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';


@Component({
  selector: 'linkedin-creative-performance',
  templateUrl: './linkedin-creative-performance.component.html',
})
export class LinkedInCreativePerformanceComponent {
  loading: boolean = true;
  creativeGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'total_engagements'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.linkedInTotals(),
      dataService.linkedInCreative(),
    ]).subscribe(([totals, creatives]) => {
        this.loading = false;
        this.totals = totals;
        this.creativeGroups = (creatives ?? [])
          .filter(c => c.name !== null && c.name !== 'n/a')
          .sortBy(c => -c.metrics.impressions.value)
          .inGroupsOf(10)
          .map('compact');
      })
  }
}
