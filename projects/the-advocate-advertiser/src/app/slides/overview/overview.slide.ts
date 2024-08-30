import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { Variables } from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Metadata, ChartConfig } from '../../services/the-advocate-data.service'
import { size } from 'lodash'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading: boolean = true
  metadata?: Metadata
  totals: Partial<Readonly<Record<string, MetricValue>>>
  hasTotals: boolean = false;
  series: any
  chartConfig: ChartConfig

  constructor(
    dataService: TheAdvocateDataService,
    variables: Variables,
    ) {
    combineLatest([dataService.metadata(), dataService.totals(), dataService.totalsByDay()])
      .subscribe(([metadata, totals, advertiserByDay]) => {
        this.loading = false
        this.metadata = metadata
        this.totals = totals
        this.hasTotals = size(totals) > 0;
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'impressions', splines: ['clicks', 'ctr']}
      })
  }
}
