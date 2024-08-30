import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { CmiDataService } from '../../services/cmi-data.service'

@Component({
  selector: 'auto-dynamic-summary',
  templateUrl: './auto-dynamic-summary.slide.html',
  styleUrls: ['./auto-dynamic-summary.slide.less']
})
export class AutoDynamicSummarySlide {
  loading = true
  hasAutoDynamic = false
  _delivered_clicks = 0
  _attributed_pageviews = 0

  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.autoDynamicCampaign(),
      dataService.hasAutoDynamic(),
    ]).subscribe(([campaign, hasAutoDynamic]) => {
      this.hasAutoDynamic = hasAutoDynamic
      if (hasAutoDynamic) {
        const {
          _delivered_clicks,
          _attributed_pageviews,
        } = campaign.getChartSeries(['_delivered_clicks', '_attributed_pageviews'])
          .reduce((acc, { name, data }) => {
            acc[name] = data[0] && data[0].pop() || 0
            return acc
          }, {})
        this._delivered_clicks = _delivered_clicks
        this._attributed_pageviews = _attributed_pageviews
      }
      this.loading = false
    })
  }
}
