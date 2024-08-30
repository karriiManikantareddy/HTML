import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service'

@Component({
  selector: 'google-analytics-overview',
  templateUrl: './google-analytics-overview.slide.html',
})
export class GoogleAnalyticsOverviewSlide {
  loading: boolean = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: TheAdvocateDataService,
    ) {
    combineLatest([
      dataService.googleAnalyticsTotals(),
      dataService.googleAnalyticsTotalsByDay(),
    ]).subscribe(([totals, advertiserByDay]) => {
      this.loading = false
      this.totals = totals
      this.series = advertiserByDay
      this.chartConfig = { barMetric: 'active_users', splines: ['sessions']}
    })
  }
}
