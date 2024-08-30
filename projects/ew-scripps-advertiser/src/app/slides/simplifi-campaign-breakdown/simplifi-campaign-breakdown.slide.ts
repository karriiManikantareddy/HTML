import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'simplifi-campaign-breakdown',
  templateUrl: './simplifi-campaign-breakdown.slide.html',
})
export class SimplifiCampaignBreakdownSlide {
  loading = true
  campaigns?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'total_visits', 'conversions']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.simplifiTotals(),
      dataService.simplifiCampaignBreakdownItems(),
    ]).subscribe(([totals, campaigns]) => {
      this.loading = false
      this.totals = totals
      this.campaigns = campaigns
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 5)
    })
  }
}
