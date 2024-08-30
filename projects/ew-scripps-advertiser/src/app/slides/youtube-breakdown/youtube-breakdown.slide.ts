import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'youtube-breakdown',
  templateUrl: './youtube-breakdown.slide.html',
})
export class YoutubeBreakdownSlide {
  loading = true
  creatives?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'vcr']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.youtubeTotals(),
      dataService.youtubeBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false
      this.totals = totals
      this.creatives = creatives
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 5)
    })
  }
}
