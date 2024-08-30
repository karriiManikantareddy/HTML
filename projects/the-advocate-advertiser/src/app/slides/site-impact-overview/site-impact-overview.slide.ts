import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service'

@Component({
  selector: 'site-impact-overview',
  templateUrl: './site-impact-overview.slide.html',
})
export class SiteImpactOverviewSlide {
  loading: boolean = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: TheAdvocateDataService,
    ) {
    combineLatest([dataService.siteImpactTotals(), dataService.siteImpactTotalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'quantity', splines: ['opens']}
      })
  }
}
