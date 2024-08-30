import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'facebook-breakdown',
  templateUrl: './facebook-breakdown.slide.html',
})
export class FacebookBreakdownSlide {
  loading = true
  ads?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'link_clicks', 'ctr', 'conversions']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.facebookTotals(),
      dataService.facebookBreakdownItems(),
    ]).subscribe(([totals, ads]) => {
      this.loading = false
      this.totals = totals
      this.ads = ads
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 4)
    })
  }
}
