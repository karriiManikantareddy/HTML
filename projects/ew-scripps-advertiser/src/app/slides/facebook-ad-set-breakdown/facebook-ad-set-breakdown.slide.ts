import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'facebook-ad-set-breakdown',
  templateUrl: './facebook-ad-set-breakdown.slide.html',
})
export class FacebookAdSetBreakdownSlide {
  loading = true
  adSets?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'link_clicks', 'ctr', 'conversions']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.facebookTotals(),
      dataService.facebookAdSetBreakdownItems(),
    ]).subscribe(([totals, adSets]) => {
      this.loading = false
      this.totals = totals
      this.adSets = adSets
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 4)
    })
  }
}
