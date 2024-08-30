import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'madhive-breakdown',
  templateUrl: './madhive-breakdown.slide.html',
})
export class MadhiveBreakdownSlide {
  loading = true
  creatives?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions_total', 'vcr']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.madhiveTotals(),
      dataService.madhiveBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creatives = creatives
        .sortBy(c => -c.metrics.impressions_total.value)
        .slice(0, 5)
    })
  }
}
