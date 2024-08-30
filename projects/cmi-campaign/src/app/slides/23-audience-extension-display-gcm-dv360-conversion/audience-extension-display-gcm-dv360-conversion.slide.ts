import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-display-gcm-dv360-conversion',
  templateUrl: './audience-extension-display-gcm-dv360-conversion.slide.html',
  styleUrls: ['./audience-extension-display-gcm-dv360-conversion.slide.less']
})
export class AudienceExtensionDisplayGcmDv360ConversionSlide {
  loading = true
  hasAed = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_click_through_conversions', name_1: 'Click Thru Visits', format: 'number', description: 'No. of visits to your website from clicking the ad'},
    {metric: '_view_through_conversions', name_1: 'View Thru Visits', format: 'number', description: 'No. of visits to your website without clicking the ad'},
    {metric: '_total_conversions', name_1: 'Total Conversions', format: 'number', description: 'No. of times the next step was taken'}
  ]
  footerMetrics = [
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown', classes: ['extra', 'border']},
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
    dataService
      .mappedGoogleCampaignManagerCreative()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .filter(row => row.getSliceId('_placement_strategy')
              && row.getSliceId('_placement_strategy').includes('DV360 Display'))
            .map(row => ({
              id: row.getSliceId('_creative'),
              name: row.getData('_creative')._creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics._total_conversions))
            .sort((a, b) => b.metrics._total_conversions - a.metrics._total_conversions || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
