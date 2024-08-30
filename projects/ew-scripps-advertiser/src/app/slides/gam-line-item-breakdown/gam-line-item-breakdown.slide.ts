import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'gam-line-item-breakdown',
  templateUrl: './gam-line-item-breakdown.slide.html',
})
export class GamLineItemBreakdownSlide {
  loading = true
  lineItems?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['total_line_item_level_impressions', 'total_line_item_level_clicks', 'ctr', 'vcr']
  headerText: string

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.gamTotals(),
      dataService.gamLineItemBreakdownItems(),
      dataService.metadata(),
    ]).subscribe(([totals, lineItems, metadata]) => {
        this.loading = false
        this.totals = totals
        this.headerText = (metadata && metadata.station) + ' Line Item Performance'
        this.lineItems = lineItems
          .sortBy(c => -c.metrics.total_line_item_level_clicks.value)
          .slice(0, 5)
      })
  }
}
