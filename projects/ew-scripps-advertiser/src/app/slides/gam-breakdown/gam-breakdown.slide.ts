import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'gam-breakdown',
  templateUrl: './gam-breakdown.slide.html',
})
export class GamBreakdownSlide {
  loading = true
  creatives?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['total_line_item_level_impressions', 'total_line_item_level_clicks', 'ctr', 'vcr']
  headerText: string

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.gamTotals(),
      dataService.gamBreakdownItems(),
      dataService.metadata(),
    ]).subscribe(([totals, creatives, metadata]) => {
        this.loading = false
        this.totals = totals
        this.headerText = (metadata && metadata.station) + ' Ad Performance'
        this.creatives = creatives
          .sortBy(c => -c.metrics.total_line_item_level_clicks.value)
          .slice(0, 5)
      })
  }
}
