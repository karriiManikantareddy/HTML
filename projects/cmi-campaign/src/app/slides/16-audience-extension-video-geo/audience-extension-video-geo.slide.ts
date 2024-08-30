import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-video-geo',
  templateUrl: './audience-extension-video-geo.slide.html',
  styleUrls: ['./audience-extension-video-geo.slide.less']
})
export class AudienceExtensionVideoGeoSlide {
  loading = true
  hasAEV = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'clickthrough_visits', name_1: 'Click Thru Visits', format: 'number', separator: 'comma', description: 'No. of visits to your website from clicking the ad'},
    {metric: 'viewthrough_visits', name_1: 'View Thru Visits', format: 'number', separator: 'comma', description: 'No. of visits to your website without clicking the ad'},
    {metric: 'conversions', name_1: 'Total Conversions', format: 'number', separator: 'comma', description: 'No. of times the next step was taken'}
  ]
  footerMetrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', separator: 'comma', description: 'No. of times your message was shown', classes: ['extra', 'border']},
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAEV().subscribe(hasAEV => this.hasAEV = hasAEV)
    dataService
      .mappedVideoSimplifiTargetGeo()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .map(row => ({
              id: row.getSliceId('creative'),
              name: row.getData('creative').creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.conversions))
            .sort((a, b) => b.metrics.conversions - a.metrics.conversions || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
