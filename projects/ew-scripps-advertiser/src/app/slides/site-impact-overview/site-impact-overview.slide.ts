import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, ChartConfig} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'site-impact-overview',
  templateUrl: './site-impact-overview.slide.html',
})
export class SiteImpactOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: EwScrippsDataService,
    ) {
    forkJoin([dataService.siteImpactTotals(), dataService.siteImpactTotalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'opens', splines: ['open_rate', 'ctr']}
      })
  }
}
