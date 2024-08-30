import {Component} from '@angular/core'
import {isNil} from 'lodash'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'search-keywords-performance',
  templateUrl: './search-keywords-performance.slide.html',
  styleUrls: ['./search-keywords-performance.slide.less']
})
export class SearchKeywordsPerformanceSlide {
  loading = true
  hasSearch = false
  keywords = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your website'},
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown'},
    {metric: 'cpc', name_1: 'Average CPC', format: 'currency', description: 'Total cost of clicks / no. of clicks'},
    {metric: 'top_impression_share', name_1: 'Top Impression Share', format: 'percent', description: 'Percentage of times ads appeared anywhere above organic results'},
    {metric: 'search_impressions_share', name_1: 'Search Impression Share', format: 'percent', description: 'Impressions / estimated no. of impressions you were eligible to receive'},
    {metric: 'search_impression_lost_to_rank', name_1: 'Search Rank Lost Impression Share', format: 'percent', description: 'Percentage of time your ads weren’t shown due to poor Ad Rank in the auction'}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasSearch().subscribe(hasSearch => this.hasSearch = hasSearch)
    dataService
      .googleAdsKeyword()
      .subscribe(keyword => {
        if (keyword) {
          this.keywords = keyword.rows
            .map(row => ({
              id: row.getSliceId('keyword'),
              name: row.getData('keyword').keyword,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.impressions))
            .sort((a, b) => b.metrics.impressions - a.metrics.impressions || (b.name > a.name ? 0 : -1))
            .splice(0, 5)
        }
        this.loading = false
      })
  }
}
