import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'facebook-ad-set-breakdown',
  templateUrl: './facebook-ad-set-breakdown.slide.html',
})
export class FacebookAdSetBreakdownSlide {
  loading: boolean = true
  adSetGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'link_clicks', 'ctr', 'post_engagements']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.facebookTotals(),
      dataService.facebookAdSetBreakdownItems(),
    ]).subscribe(([totals, adSets]) => {
      this.loading = false
      this.totals = totals
      this.adSetGroups = adSets
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
