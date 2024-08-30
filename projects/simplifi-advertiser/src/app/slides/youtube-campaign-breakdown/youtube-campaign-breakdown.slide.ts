import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'youtube-campaign-breakdown',
  templateUrl: './youtube-campaign-breakdown.slide.html',
})
export class YoutubeCampaignBreakdownSlide {
  loading = true
  campaigns?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'video_completes', 'conversions']

  constructor(dataService: SimplifiDataService) {
    combineLatest([
      dataService.youtubeTotals(),
      dataService.youtubeCampaignBreakdownItems()
    ]).subscribe(([totals, campaigns]) => {
      this.loading = false
      this.totals = totals
      this.campaigns = campaigns
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 10)
    })
  }
}
