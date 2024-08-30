import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-video-gcm-amazon',
  templateUrl: './audience-extension-video-gcm-amazon.slide.html',
  styleUrls: ['./audience-extension-video-gcm-amazon.slide.less']
})
export class AudienceExtensionVideoGcmAmazonSlide {
  loading = true
  hasAEV = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', separator: 'comma', description: 'No. of times your message was shown'},
    {metric: 'video_view_rate', name_1: 'Video Completion Rate', format: 'percent', description: 'Percentage of views where the video was watched to completion'},
    {metric: '_video_first_quartile_completions', name_1: 'Video Completions', name_2: '25%', format: 'number', separator: 'comma', description: 'No. of views that completed ___% of your ad (by quartile)'},
    {metric: '_video_midpoints', name_2: '50%', format: 'number', separator: 'comma'},
    {metric: '_video_third_quartile_completions', name_2: '75%', format: 'number', separator: 'comma'},
    {metric: '_video_completions', name_2: '100%', format: 'number', separator: 'comma'}
  ]
  footerMetrics = [
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown', classes: ['extra', 'border']}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAEV().subscribe(hasAEV => this.hasAEV = hasAEV)
    dataService
      .mappedGoogleCampaignManagerCreative()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .filter(row => row.getSliceId('_placement_strategy')
              && row.getSliceId('_placement_strategy').includes('DV360 Video'))
            .map(row => ({
              id: row.getSliceId('_creative'),
              name: row.getData('_creative')._creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.video_view_rate))
            .sort((a, b) => b.metrics.video_view_rate - a.metrics.video_view_rate || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
