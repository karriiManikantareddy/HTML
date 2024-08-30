import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'site-impact-breakdown',
  templateUrl: './site-impact-breakdown.slide.html',
})
export class SiteImpactBreakdownSlide {
  loading = true
  creatives?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['opens', 'open_rate', 'clicks', 'ctr']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.siteImpactTotals(),
      dataService.siteImpactBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creatives = creatives
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 6)
    })
  }
}
