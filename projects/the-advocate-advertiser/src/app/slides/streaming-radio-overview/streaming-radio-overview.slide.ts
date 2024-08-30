import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-radio-overview',
  templateUrl: './streaming-radio-overview.slide.html',
})
export class StreamingRadioOverviewSlide {
  loading: boolean = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: TheAdvocateDataService,
    ) {
    combineLatest([
      dataService.streamingRadioTotals(),
      dataService.streamingRadioTotalsByDay(),
    ]).subscribe(([totals, advertiserByDay]) => {
      this.loading = false
      this.totals = totals
      this.series = advertiserByDay
      this.chartConfig = { barMetric: 'impressions', splines: ['completion_rate']}
    })
  }
}
