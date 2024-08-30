import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {CmiDataService} from '../../services/cmi-data.service'
import {Formats} from '../../../../../template-module/src/lib/pipes/table-value.pipe'

@Component({
  selector: 'social-clicks-performance-overview',
  templateUrl: './social-clicks-performance-overview.slide.html',
  styleUrls: ['./social-clicks-performance-overview.slide.less']
})
export class SocialClicksPerformanceOverviewSlide {
  loading = true
  hasSocial = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your social media page/website'},
    {metric: 'ctr', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was '},
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
  ]
  footerMetrics = [
    {metric: 'reach', name_1: 'Reach', format: 'number', description: 'No. of people your message was shown to', classes: ['extra', 'border']},
    {metric: 'frequency', name_1: 'Frequency', format: 'number', description: 'No. of times your message was shown to someone', classes: ['extra']},
  ]

  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.socialCampaign(),
      dataService.hasSocial(),
    ]).subscribe(([socialCampaignData, hasSocial]) => {
      this.hasSocial = hasSocial
      if (hasSocial) {
        const reach = socialCampaignData.rows[0].getMetricValue('_reach')
        const frequency = socialCampaignData.rows[0].getMetricValue('_impressions') / reach
        this.creatives = [{
          id: 'total',
          name: 'Total',
          metrics: {
            _impressions: socialCampaignData.rows[0].getMetricValue('_impressions'),
            _clicks: socialCampaignData.rows[0].getMetricValue('_clicks'),
            ctr: socialCampaignData.rows[0].getMetricValue('ctr'),
            frequency,
            reach,
          }
        }]
      }
      this.loading = false
    })
  }

  getFormatOptions(metric: string, format: Formats) {
    return format === Formats.NUMBER && metric === 'frequency'
      ? { format: '1.0-1'}
      : {}
  }
}
