import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'performance-overview',
  templateUrl: './performance-overview.slide.html',
  styleUrls: ['./performance-overview.slide.less']
})
export class PerformanceOverviewSlide {
  loading = true
  hasTve = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', separator: 'comma', description: 'No. of times your message was shown'},
    {metric: 'vcr', name_1: 'Video Completion Rate', format: 'percent', description: 'Percentage of views where the video was watched to completion'},
    {metric: 'completions25', name_1: 'Video Completions', name_2: '25%', format: 'number', separator: 'comma', description: 'No. of views that completed ___% of your ad (by quartile)'},
    {metric: 'completions50', name_2: '50%', format: 'number', separator: 'comma'},
    {metric: 'completions75', name_2: '75%', format: 'number', separator: 'comma'},
    {metric: 'completions100', name_2: '100%', format: 'number', separator: 'comma'}
  ]
  footerMetrics = [
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown', classes: ['extra', 'border']}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasTVE().subscribe(hasTve => this.hasTve = hasTve)
    dataService
      .tveCreative()
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
              }
            ))
            .filter(({ metrics }) => !isNil(metrics.vcr))
            .sort((a, b) => b.metrics.vcr - a.metrics.vcr || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
          }
        this.loading = false
      })
  }
}
