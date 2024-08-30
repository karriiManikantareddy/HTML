import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'social-leads-performance-overview',
  templateUrl: './social-leads-performance-overview.slide.html',
  styleUrls: ['./social-leads-performance-overview.slide.less']
})
export class SocialLeadsPerformanceOverviewSlide {
  loading = true
  hasSocial = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: '_onsite_conversion_lead_grouped', name_1: 'Leads Generated', format: 'number', description: 'No. of total form submissions'},
    {metric: 'cpl', name_1: 'Cost per Lead', format: 'currency', description: 'Average cost per form submission'},
  ]
  footerMetrics = [
    {metric: '_clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your social media page/website', classes: ['extra', 'border']},
    {metric: 'ctr', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was ', classes: ['extra']},
  ]

  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.socialCampaign(),
      dataService.hasSocial(),
    ]).subscribe(([socialCampaignData, hasSocial]) => {
      this.hasSocial = hasSocial
      if (hasSocial) {
        this.creatives = [{
          id: 'total',
          name: 'Total',
          metrics: {
            _impressions: socialCampaignData.rows[0].getMetricValue('_impressions'),
            _onsite_conversion_lead_grouped: socialCampaignData.rows[0].getMetricValue('_onsite_conversion_lead_grouped'),
            cpl: socialCampaignData.rows[0].getMetricValue('cpl'),
            _clicks: socialCampaignData.rows[0].getMetricValue('_clicks'),
            ctr: socialCampaignData.rows[0].getMetricValue('ctr'),
          }
        }]
      }
      this.loading = false
    })
  }
}
