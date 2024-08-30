import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-video-verve',
  templateUrl: './audience-extension-video-verve.slide.html',
  styleUrls: ['./audience-extension-video-verve.slide.less']
})
export class AudienceExtensionVideoVerveSlide {
  loading = true
  hasAEV = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', separator: 'comma', description: 'No. of times your message was shown'},
    {metric: 'total_actions', name_1: 'Total Actions', format: 'number', separator: 'comma', description: 'No. of engagements with full screen ad'},
    {metric: 'action_rate', name_1: 'Action Rate', format: 'percent', description: 'No. of engagements / no. of clicks'}
  ]
  footerMetrics = [
    {metric: 'vcr', name_1: 'Video Completion Rate ', format: 'percent', description: 'Percentage of views where the video was watched to completion', classes: ['extra', 'border']},
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAEV().subscribe(hasAEV => this.hasAEV = hasAEV)
    dataService
      .audienceExtensionVideoCreative()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .filter(row => row.getSliceId('datasource') === 'verve')
            .map(row => ({
              id: row.getSliceId('creative'),
              name: row.getData('creative').creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.vcr))
            .sort((a, b) => b.metrics.vcr - a.metrics.vcr || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
