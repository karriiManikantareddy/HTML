import { Component } from '@angular/core'
import { CmiDataService } from '../../services/cmi-data.service'

@Component({
  selector: 'search-summary',
  templateUrl: './search-summary.slide.html',
  styleUrls: ['./search-summary.slide.less']
})
export class SearchSummarySlide {
  loading = true
  hasSearch = false
  impressions = 0
  clicks = 0
  cpc = 0

  constructor(dataService: CmiDataService) {
    dataService.hasSearch().subscribe(hasSearch => this.hasSearch = hasSearch)
    dataService
      .googleAdsCampaign()
      .subscribe((campaign) => {
        if (campaign) {
          const {
            clicks,
            impressions,
            cpc
          } = campaign.getChartSeries(['clicks', 'impressions', 'cpc'])
            .reduce((acc, { name, data }) => {
              acc[name] = data[0] && data[0].pop() || 0
              return acc
            }, {})
          this.impressions = impressions
          this.clicks = clicks
          this.cpc = cpc
        }
        this.loading = false
      })
  }
}
