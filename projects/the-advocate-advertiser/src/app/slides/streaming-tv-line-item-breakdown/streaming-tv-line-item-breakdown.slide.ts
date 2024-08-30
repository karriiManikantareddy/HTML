import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-tv-line-item-breakdown',
  templateUrl: './streaming-tv-line-item-breakdown.slide.html',
})
export class StreamingTvLineItemBreakdownSlide {
  loading: boolean = true
  lineItemGroups?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'completion_rate', 'conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.streamingTvTotals(),
      dataService.streamingTvLineItemBreakdownItems(),
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
