import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-radio-breakdown',
  templateUrl: './streaming-radio-breakdown.slide.html',
})
export class StreamingRadioBreakdownSlide {
  loading: boolean = true
  creativeGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions',  'completion_rate', 'conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.streamingRadioTotals(),
      dataService.streamingRadioBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creativeGroups = creatives
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
