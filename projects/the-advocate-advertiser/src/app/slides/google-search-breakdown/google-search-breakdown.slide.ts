import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'google-search-breakdown',
  templateUrl: './google-search-breakdown.slide.html',
})
export class GoogleSearchBreakdownSlide {
  loading: boolean = true;
  creativeGroups?: Item[][];
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'all_conv','search_impr_share'];

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.googleSearchTotals(),
      dataService.googleSearchBreakdownItems()
    ]).subscribe(([totals, creatives]) => {
      this.loading = false;
      this.totals = totals;
      this.creativeGroups = creatives
        .sortBy(c => -c.metrics.clicks.value)
        .inGroupsOf(10)
        .map('compact');
    })
  }
}
