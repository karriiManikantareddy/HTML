import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'facebook-breakdown',
  templateUrl: './facebook-breakdown.slide.html',
})
export class FacebookBreakdownSlide {
  loading: boolean = true
  adsGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'link_clicks', 'ctr', 'post_engagements']
  videoKpis: string[] = ['video_plays', 'video_p25_views', 'video_p50_views', 'video_p75_views', 'video_p100_views', 'time_watched', 'vcr']
  engagementKpis: string[] = ['post_engagements', 'clicks', 'post_reactions', 'comments', 'posts', 'impressions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.facebookTotals(),
      dataService.facebookBreakdownItems(),
    ]).subscribe(([totals, ads]) => {
      this.loading = false
      this.totals = totals
      this.adsGroups = ads
        .sortBy(c => -c.metrics.clicks.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
