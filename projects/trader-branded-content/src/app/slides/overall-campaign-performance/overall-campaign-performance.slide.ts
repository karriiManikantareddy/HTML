import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {GaAdvertiser, DfpContentAction, StandardDataService} from '../../services/standard-data.service'

@Component({
  selector: 'overall-campaign-performance',
  templateUrl: './overall-campaign-performance.slide.html',
  styleUrls: ['./overall-campaign-performance.slide.less']
})

export class OverallCampaignPerformanceSlide {
  loading: boolean = true
  totals: GaAdvertiser
  engagementRate: number
  brandIntent: number

  constructor(
    dataService: StandardDataService,
  ) {
    combineLatest([
      dataService.gaAdvertiser(),
      dataService.dfpContentAction()
    ])
    .subscribe(([gaTotals, dfpContentAction]) => {
      this.loading = false;
      this.totals = gaTotals

      const dfpImpressionsEngagement = dfpContentAction
        .filter(c => c.data.line_item_content_action.toLowerCase() === 'engagement')
        .sum(c => c.metrics.total_line_item_level_impressions)

      const dfpImpressionsOutboundClicks = dfpContentAction
        .filter(c => c.data.line_item_content_action.toLowerCase() === 'outbound clicks')
        .sum(c => c.metrics.total_line_item_level_impressions)

      this.engagementRate = (dfpImpressionsEngagement / (this.totals && this.totals.metrics.sessions)) || 0
      this.brandIntent = (dfpImpressionsOutboundClicks / (this.totals && this.totals.metrics.sessions)) || 0
    })
  }
}
