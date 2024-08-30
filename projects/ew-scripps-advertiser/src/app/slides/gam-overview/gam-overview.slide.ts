import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, ChartConfig} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'gam-overview',
  templateUrl: './gam-overview.slide.html',
})
export class GamOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig
  headerText: string

  constructor(
    dataService: EwScrippsDataService,
    ) {
    combineLatest([
      dataService.gamTotals(),
      dataService.gamTotalsByDay(),
      dataService.metadata(),
    ]).subscribe(([totals, advertiserByDay, metadata]) => {
      this.loading = false
      this.totals = totals
      this.headerText = (metadata && metadata.station) + ' Overview'
      this.series = advertiserByDay
      this.chartConfig = { barMetric: 'total_line_item_level_impressions', splines: ['total_line_item_level_clicks', 'ctr']}
    })
  }
}
