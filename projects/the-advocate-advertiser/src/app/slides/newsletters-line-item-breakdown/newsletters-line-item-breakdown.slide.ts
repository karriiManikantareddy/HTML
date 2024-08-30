import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'newsletters-line-item-breakdown',
  templateUrl: './newsletters-line-item-breakdown.slide.html',
})
export class NewslettersLineItemBreakdownSlide {
  loading: boolean = true
  lineItemGroups?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'total_time_in_view', 'conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.newslettersTotals(),
      dataService.newslettersLineItemBreakdownItems(),
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
