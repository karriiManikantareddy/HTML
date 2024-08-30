import {Component} from '@angular/core'
import {isNil} from 'lodash'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'cta-display-performance',
  templateUrl: './cta-display-performance.slide.html',
  styleUrls: ['./cta-display-performance.slide.less']
})
export class CtaDisplayPerformanceSlide {
  loading = false
  hasAed = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'total_actions', name_1: 'Total Actions', format: 'number', description: 'No. of engagements with full screen ad'},
    {metric: 'action_rate', name_1: 'Action Rate', format: 'percent', description: 'No. of engagements / no. of clicks'}
  ]
  footerMetrics = [
    {metric: 'clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your full screen ad', classes: ['extra', 'border']},
    {metric: 'click_rate', name_1: 'Click Thru Rate ', format: 'percent', description: 'No. of clicks / no. of times your message was shown', classes: ['extra']},
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
    dataService
      .audienceExtensionDisplayCreative()
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
            .filter(row => !isNil(row.metrics.click_rate))
            .sort((a, b) => b.metrics.click_rate - a.metrics.click_rate || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
      })
  }
}
