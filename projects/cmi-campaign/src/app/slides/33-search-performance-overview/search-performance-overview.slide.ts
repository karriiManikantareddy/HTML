import {Component} from '@angular/core'
import {isNil} from 'lodash'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'search-performance-overview',
  templateUrl: './search-performance-overview.slide.html',
  styleUrls: ['./search-performance-overview.slide.less']
})
export class SearchPerformanceOverviewSlide {
  loading = true
  hasSearch = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your website'},
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown'},
    {metric: 'cpc', name_1: 'Average CPC', format: 'currency', description: 'Total cost of clicks / no. of clicks'},
    {metric: 'phone_calls', name_1: 'Calls', format: 'number', description: 'No. of times someone called from your ad'},
    {metric: 'conversions', name_1: 'Conversions', format: 'number', description: 'No. of times someone interacted with you ad(s)'},
    {metric: 'search_impressions_share', name_1: 'Search Impression Share', format: 'percent', description: 'Impressions / estimated no. of impressions you were eligible to receive'},
    {metric: 'search_impression_lost_to_rank', name_1: 'Search Rank Lost Impression Share', format: 'percent', description: 'Percentage of time your ads weren’t shown due to poor Ad Rank in the auction'}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasSearch().subscribe(hasSearch => this.hasSearch = hasSearch)
    dataService
      .googleAdsAd()
      .subscribe(ad => {
        if (ad && ad.rows) {
          this.creatives = ad.rows
            .map(row => ({
              id: row.getSliceId('ad'),
              name: row.getData('ad').ad,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.impressions))
            .sort((a, b) => b.metrics.impressions - a.metrics.impressions || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
