import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, ChartConfig} from '../../services/simplifi-data.service'

@Component({
  selector: 'youtube-overview',
  templateUrl: './youtube-overview.slide.html',
})
export class YoutubeOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  series: any
  chartConfig: ChartConfig
  kpis: string[] = ['impressions', 'clicks', 'conversions', 'video_completes']

  constructor(
    dataService: SimplifiDataService,
    ) {
    forkJoin([
      dataService.youtubeTotals(),
      dataService.youtubeTotalsByDay()
    ]).subscribe(([totals, advertiserByDay]) => {
      this.loading = false
      this.totals = totals
      this.series = advertiserByDay
      this.chartConfig = { barMetric: 'impressions', splines: ['video_completes']}
    })
  }
}
