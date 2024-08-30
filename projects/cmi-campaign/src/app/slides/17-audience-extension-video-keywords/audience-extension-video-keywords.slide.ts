import {Component} from '@angular/core'
import isNil from 'lodash/isNil'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'audience-extension-video-keywords',
  templateUrl: './audience-extension-video-keywords.slide.html',
  styleUrls: ['./audience-extension-video-keywords.slide.less']
})
export class AudienceExtensionVideoKeywordsSlide {
  loading = true
  hasAEV = false
  creatives = [{
    name: 'total',
    metrics: {
      impressions: 0,
      vcr: 0.0,
      completions25: 0,
      completions50: 0,
      completions75: 0,
      completions100: 0,
    }
  }]
  keywords = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', separator: 'comma', description: 'No. of times your message was shown'},
    {metric: 'vcr', name_1: 'Video Completion Rate', format: 'percent', description: 'Percentage of views where the video was watched to completion'},
    {metric: 'completions25', name_1: 'Video Completions', name_2: '25%', format: 'number', separator: 'comma', description: 'No. of views that completed ___% of your ad (by quartile)'},
    {metric: 'completions50', name_2: '50%', format: 'number', separator: 'comma'},
    {metric: 'completions75', name_2: '75%', format: 'number', separator: 'comma'},
    {metric: 'completions100', name_2: '100%', format: 'number', separator: 'comma'},
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAEV().subscribe(hasAEV => this.hasAEV = hasAEV)
    dataService
      .mappedVideoSimplifiTargetKeyword()
      .subscribe(creative => {
        if (creative) {
          this.keywords = creative.rows
            .map(row => ({
              name: row.getData('keyword_name').keyword_name,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                if (n === 'impressions') {
                  this.creatives[0].metrics.impressions += v || 0
                }
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.impressions))
            .sort((a, b) => b.metrics.impressions - a.metrics.impressions || (b.name > a.name ? 0 : -1))
            .splice(0, 15)
            .map(({ name }) => name)
        }
        this.loading = false
      })
  }
}
