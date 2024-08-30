import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, ChartConfig} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'madhive-overview',
  templateUrl: './madhive-overview.slide.html',
})
export class MadhiveOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: EwScrippsDataService,
    ) {
    forkJoin([dataService.madhiveTotals(), dataService.madhiveTotalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'impressions_total', splines: ['vcr']}
      })
  }
}
