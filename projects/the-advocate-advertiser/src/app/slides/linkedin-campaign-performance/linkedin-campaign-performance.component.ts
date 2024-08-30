import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';

@Component({
  selector: 'linkedin-campaign-performance',
  templateUrl: './linkedin-campaign-performance.component.html',
})
export class LinkedInCampaignPerformanceComponent {
  loading: boolean = true;
  campaignGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'total_engagements'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.linkedInTotals(),
      dataService.linkedInCampaignBreakdownItems(),
    ]).subscribe(([totals, campaigns]) => {
      this.loading = false;
      this.totals = totals;
      this.campaignGroups = (campaigns ?? [])
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact');
    })
  }
}
