import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, ChartConfig} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'callrail-overview',
  templateUrl: './callrail-overview.slide.html',
})
export class CallrailOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig
  chartRightConfig: ChartConfig

  constructor(
    dataService: EwScrippsDataService,
    ) {
    forkJoin([dataService.callrailTotals(), dataService.callrailTotalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'total_calls', splines: ['answer_rate']}
      })
  }
}
