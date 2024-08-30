import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'facebook-campaign-breakdown',
  templateUrl: './facebook-campaign-breakdown.slide.html',
})
export class FacebookCampaignBreakdownSlide {
  loading: boolean = true
  campaignGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'link_clicks', 'ctr', 'post_engagements']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.facebookTotals(),
      dataService.facebookCampaignBreakdownItems(),
    ]).subscribe(([totals, campaigns]) => {
      this.loading = false
      this.totals = totals
      this.campaignGroups = campaigns
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
