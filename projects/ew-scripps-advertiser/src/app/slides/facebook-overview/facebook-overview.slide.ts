import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, ChartConfig} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'facebook-overview',
  templateUrl: './facebook-overview.slide.html',
})
export class FacebookOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: EwScrippsDataService,
    ) {
    forkJoin([dataService.facebookTotals(), dataService.facebookTotalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'impressions', splines: ['ctr']}
      })
  }
}
