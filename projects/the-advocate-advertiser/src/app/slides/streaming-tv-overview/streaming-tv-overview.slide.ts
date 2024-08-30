import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-tv-overview',
  templateUrl: './streaming-tv-overview.slide.html',
})
export class StreamingTvOverviewSlide {
  loading: boolean = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: TheAdvocateDataService,
    ) {
    combineLatest([
      dataService.streamingTvTotals(),
      dataService.streamingTvTotalsByDay(),
    ]).subscribe(([totals, advertiserByDay]) => {
      this.loading = false
      this.totals = totals
      this.series = advertiserByDay
      this.chartConfig = { barMetric: 'impressions', splines: ['clicks', 'ctr']}
    })
  }
}
