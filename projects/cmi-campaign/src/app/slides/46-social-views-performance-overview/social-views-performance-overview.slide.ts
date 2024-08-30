import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'social-views-performance-overview',
  templateUrl: './social-views-performance-overview.slide.html',
  styleUrls: ['./social-views-performance-overview.slide.less']
})
export class SocialViewsPerformanceOverviewSlide {
  loading = true
  hasSocial = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'vcr', name_1: 'Video Completion Rate', format: 'percent', description: 'Percentage of views where the video was watched to completion'},
    {metric: '_video_p25_watched_actions', name_1: 'Video Completions', name_2: '25%', format: 'number', description: 'No. of views that completed ___% of your ad (by quartile)'},
    {metric: '_video_p50_watched_actions', name_2: '50%', format: 'number'},
    {metric: '_video_p75_watched_actions', name_2: '75%', format: 'number'},
    {metric: '_video_p100_watched_actions', name_2: '100%', format: 'number'},
  ]
  footerMetrics = [
    {metric: '_clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your social media page/website', classes: ['extra', 'border']},
    {metric: 'ctr', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown', classes: ['extra']}
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
            _clicks: socialCampaignData.rows[0].getMetricValue('_clicks'),
            ctr: socialCampaignData.rows[0].getMetricValue('ctr'),
            vcr: socialCampaignData.rows[0].getMetricValue('vcr'),
            _video_p25_watched_actions: socialCampaignData.rows[0].getMetricValue('_video_p25_watched_actions'),
            _video_p50_watched_actions: socialCampaignData.rows[0].getMetricValue('_video_p50_watched_actions'),
            _video_p75_watched_actions: socialCampaignData.rows[0].getMetricValue('_video_p75_watched_actions'),
            _video_p100_watched_actions: socialCampaignData.rows[0].getMetricValue('_video_p100_watched_actions'),
          }
        }]
      }
      this.loading = false
    })
  }
}
