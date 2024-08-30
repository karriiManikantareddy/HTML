import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'onsite-display-line-item-breakdown',
  templateUrl: './onsite-display-line-item-breakdown.slide.html',
})
export class OnsiteDisplayLineItemBreakdownSlide {
  loading: boolean = true
  lineItemGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'total_time_in_view', 'conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.onsiteDisplayTotals(),
      dataService.onsiteDisplayLineItemBreakdownItems(),
    ]).subscribe(([totals, lineItems]) => {
      this.loading = false
      this.totals = totals
      this.lineItemGroups = lineItems
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
