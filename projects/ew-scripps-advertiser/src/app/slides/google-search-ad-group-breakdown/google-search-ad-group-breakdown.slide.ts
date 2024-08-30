import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'google-search-ad-group-breakdown',
  templateUrl: './google-search-ad-group-breakdown.slide.html',
})
export class GoogleSearchAdGroupBreakdownSlide {
  loading = true
  adGroups?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'all_conv']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.googleSearchTotals(),
      dataService.googleSearchAdGroupBreakdownItems()
    ]).subscribe(([totals, adGroups]) => {
      this.loading = false
      this.totals = totals
      this.adGroups = adGroups
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 4)
    })
  }
}
