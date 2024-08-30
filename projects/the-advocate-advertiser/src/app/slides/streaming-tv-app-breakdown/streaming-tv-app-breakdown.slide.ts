import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-tv-app-breakdown',
  templateUrl: './streaming-tv-app-breakdown.slide.html',
})
export class StreamingTvAppBreakdownSlide {
  loading: boolean = true
  apps?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.streamingTvTotals(),
      dataService.streamingTvAppBreakdownItems(),
    ]).subscribe(([totals, apps]) => {
      this.loading = false
      this.totals = totals
      this.apps = apps
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
    })
  }
}
