import {Component} from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'auto-dynamic-performance-overview-total',
  templateUrl: './auto-dynamic-performance-overview-total.slide.html',
  styleUrls: ['./auto-dynamic-performance-overview-total.slide.less']
})
export class AutoDynamicPerformanceOverviewTotalSlide {
  loading = true
  hasAutoDynamic = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_delivered_clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your website'},
    {metric: 'delivered_click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown'},
    {metric: '_attributed_pageviews', name_1: 'Vehicle Detail Page Views', format: 'number', description: 'No. of times a user views a Vehicle Detail Page'},
    {metric: '_actions', name_1: 'Significant Actions', format: 'number', description: 'Number of actions taken on the dealer’s website'},
    {metric: 'top_new_inventory', name_1: 'Top New Inventory', format: 'number', description: 'Top new VIN indicated by total number of delivered impressions'},
    {metric: 'top_used_inventory', name_1: 'Top Used Inventory', format: 'number', description: 'Top used VIN indicated by total number of delivered impressions'}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAutoDynamic().subscribe(hasAutoDynamic => this.hasAutoDynamic = hasAutoDynamic)
    dataService
      .autoDynamicCampaignTotal()
      .subscribe(campaignMetrics => {
        this.creatives = [campaignMetrics]
        this.loading = false
      })
  }
}
