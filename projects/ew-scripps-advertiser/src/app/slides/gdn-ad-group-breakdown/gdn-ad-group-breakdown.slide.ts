import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'gdn-ad-group-breakdown',
  templateUrl: './gdn-ad-group-breakdown.slide.html',
})
export class GdnAdGroupBreakdownSlide {
  loading = true
  creatives?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'all_conv']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.gdnTotals(),
      dataService.gdnAdGroupBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creatives = creatives
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 5)
    })
  }
}
