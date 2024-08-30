import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'social-events-performance-overview',
  templateUrl: './social-events-performance-overview.slide.html',
  styleUrls: ['./social-events-performance-overview.slide.less']
})
export class SocialEventsPerformanceOverviewSlide {
  loading = true
  hasSocial = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: '_rsvp', name_1: 'Event Responses', format: 'number', description: 'No. of total RSVPs to event'},
    {metric: 'cper', name_1: 'Cost per Event Response', format: 'currency', description: 'Average cost per RSVP submitted'},
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
            _rsvp: socialCampaignData.rows[0].getMetricValue('_rsvp'),
            cper: socialCampaignData.rows[0].getMetricValue('cper'),
            _clicks: socialCampaignData.rows[0].getMetricValue('_clicks'),
            ctr: socialCampaignData.rows[0].getMetricValue('ctr'),
          }
        }]
      }
      this.loading = false
    })
  }
}
