import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-radio-app-breakdown',
  templateUrl: './streaming-radio-app-breakdown.slide.html',
})
export class StreamingRadioAppBreakdownSlide {
  loading: boolean = true
  apps?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.streamingRadioTotals(),
      dataService.streamingRadioAppBreakdownItems(),
    ]).subscribe(([totals, apps]) => {
      this.loading = false
      this.totals = totals
      this.apps = apps
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
    })
  }
}
