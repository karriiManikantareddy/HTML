import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service'

@Component({
  selector: 'extended-network-display-overview',
  templateUrl: './extended-network-display-overview.slide.html',
})
export class ExtendedNetworkDisplayOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: TheAdvocateDataService,
  ) {
    combineLatest([
      dataService.extendedNetworkDisplayTotals(),
      dataService.extendedNetworkDisplayTotalsByDay(),
    ]).subscribe(([totals, advertiserByDay]) => {
      this.loading = false
      this.totals = totals
      this.series = advertiserByDay
      this.chartConfig = { barMetric: 'impressions', splines: ['clicks']}
    })
  }
}
