import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'youtube-breakdown',
  templateUrl: './youtube-breakdown.slide.html',
})
export class YoutubeBreakdownSlide {
  loading = true
  creatives?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'video_completes', 'conversions']

  constructor(dataService: SimplifiDataService) {
    combineLatest([
      dataService.youtubeTotals(),
      dataService.youtubeBreakdownItems()
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creatives = creatives
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 10)
    })
  }
}
