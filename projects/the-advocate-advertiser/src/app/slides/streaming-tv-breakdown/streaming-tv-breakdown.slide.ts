import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'streaming-tv-breakdown',
  templateUrl: './streaming-tv-breakdown.slide.html',
})
export class StreamingTvBreakdownSlide {
  loading: boolean = true
  creativeGroups?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'completion_rate', 'conversions']
  quartileKpis: string[] = ['impressions', '25_complete', '50_complete', '75_complete', 'video_completes']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.streamingTvTotals(),
      dataService.streamingTvBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creativeGroups = creatives
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
