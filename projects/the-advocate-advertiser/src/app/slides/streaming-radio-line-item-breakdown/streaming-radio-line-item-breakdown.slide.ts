import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-radio-line-item-breakdown',
  templateUrl: './streaming-radio-line-item-breakdown.slide.html',
})
export class StreamingRadioLineItemBreakdownSlide {
  loading: boolean = true
  lineItemGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'completion_rate', 'conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.streamingRadioTotals(),
      dataService.streamingRadioLineItemBreakdownItems(),
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
