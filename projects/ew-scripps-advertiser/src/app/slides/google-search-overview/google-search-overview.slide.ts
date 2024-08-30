import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, ChartConfig} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'google-search-overview',
  templateUrl: './google-search-overview.slide.html',
})
export class GoogleSearchOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: EwScrippsDataService,
    ) {
    forkJoin([dataService.googleSearchTotals(), dataService.googleSearchTotalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'impressions', splines: ['clicks', 'ctr']}
      })
  }
}
