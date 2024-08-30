import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'site-impact-breakdown',
  templateUrl: './site-impact-breakdown.slide.html',
})
export class SiteImpactBreakdownSlide {
  loading: boolean = true
  creativeGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['opens', 'open_rate', 'clicks', 'ctr']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.siteImpactTotals(),
      dataService.siteImpactBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creativeGroups = creatives
        .sortBy(c => -c.metrics.clicks.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
