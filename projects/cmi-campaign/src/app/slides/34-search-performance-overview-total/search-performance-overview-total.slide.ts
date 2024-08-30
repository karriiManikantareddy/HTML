import {Component} from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'search-performance-overview-total',
  templateUrl: './search-performance-overview-total.slide.html',
  styleUrls: ['./search-performance-overview-total.slide.less']
})
export class SearchPerformanceOverviewTotalSlide {
  loading = true
  hasSearch = false
  creatives = []
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
      .googleAdsCampaign()
      .subscribe(campaign => {
        if (campaign) {
          const creative = campaign.rows
            .reduce((total, row) => {
              row.metrics.forEach(({ name, value }) => {
                if (Object.keys(total.metrics).includes(name)) {
                  total.metrics[name] += value
                } else {
                  total.metrics[name] = value
                }
              })
              return total
            }, {
              id: 'total',
              name: 'Total',
              metrics: {}
            })
          this.creatives = [creative]
        }
        this.loading = false
      })
  }
}
