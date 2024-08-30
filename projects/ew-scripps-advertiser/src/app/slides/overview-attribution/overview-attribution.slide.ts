import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Metadata, ChartConfig} from '../../services/ew-scripps-data.service'
import { get } from 'lodash'

@Component({
  selector: 'overview-attribution',
  templateUrl: './overview-attribution.slide.html',
  styleUrls: ['./overview-attribution.slide.less']
})
export class OverviewAttributionSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig
  hasAttribution: boolean = false

  constructor(
    dataService: EwScrippsDataService,
    variables: Variables,
    ) {
    forkJoin([dataService.attributionTotals(), dataService.totalsByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false
        this.totals = totals
        const totalConversions = get(totals, 'total_conversions.value')
        this.hasAttribution = totalConversions && totalConversions !== 0 && totalConversions !== null
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'impressions', splines: ['clicks']}
      })
  }
}
