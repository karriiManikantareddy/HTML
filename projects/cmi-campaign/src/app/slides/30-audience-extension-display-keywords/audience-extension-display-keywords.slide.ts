import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-display-keywords',
  templateUrl: './audience-extension-display-keywords.slide.html',
  styleUrls: ['./audience-extension-display-keywords.slide.less']
})
export class AudienceExtensionDisplayKeywordsSlide {
  loading = true
  hasAed = false
  creatives = [{
    name: 'total',
    metrics: {
      impressions: 0,
      clicks: 0,
      click_rate: 0.0
    }
  }]
  keywords = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your website'},
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown'}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
    dataService
      .mappedDisplaySimplifiTargetKeyword()
      .subscribe(creative => {
        if (creative) {
          this.keywords = creative.rows
            .map(row => ({
              name: row.getData('keyword_name').keyword_name,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                if (n === 'impressions') {
                  this.creatives[0].metrics.impressions += v || 0
                } else if (n === 'clicks') {
                  this.creatives[0].metrics.clicks += v || 0
                }
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.impressions))
            .sort((a, b) => b.metrics.impressions - a.metrics.impressions || (b.name > a.name ? 0 : -1))
            .splice(0, 15)
            .map(({ name }) => name)
          this.creatives[0].metrics.click_rate = this.creatives[0].metrics.clicks / this.creatives[0].metrics.impressions
        }
        this.loading = false
      })
  }
}
