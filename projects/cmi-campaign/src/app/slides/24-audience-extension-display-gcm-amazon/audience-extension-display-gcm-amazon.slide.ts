import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-display-gcm-amazon',
  templateUrl: './audience-extension-display-gcm-amazon.slide.html',
  styleUrls: ['./audience-extension-display-gcm-amazon.slide.less']
})
export class AudienceExtensionDisplayGcmAmazonSlide {
  loading = true
  hasAed = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: '_impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: '_clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your website'},
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown'}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
    dataService
      .mappedGoogleCampaignManagerCreative()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .filter(row => row.getSliceId('_placement_strategy')
              && row.getSliceId('_placement_strategy').includes('Amazon Display'))
            .map(row => ({
              id: row.getSliceId('_creative'),
              name: row.getData('_creative')._creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.click_rate))
            .sort((a, b) => b.metrics.click_rate - a.metrics.click_rate || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
