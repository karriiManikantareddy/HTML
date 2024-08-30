import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'extended-network-display-line-item-breakdown',
  templateUrl: './extended-network-display-line-item-breakdown.slide.html',
})
export class ExtendedNetworkDisplayLineItemBreakdownSlide {
  loading: boolean = true
  lineItemGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'postview_conversions', 'postclick_conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.extendedNetworkDisplayTotals(),
      dataService.extendedNetworkDisplayLineItemBreakdownItems(),
    ]).subscribe(([totals, line_items]) => {
        this.loading = false
        this.totals = totals
        this.lineItemGroups = line_items
          .sortBy(c => -c.metrics.impressions.value)
          .inGroupsOf(10)
          .map('compact')
      })
  }
}
