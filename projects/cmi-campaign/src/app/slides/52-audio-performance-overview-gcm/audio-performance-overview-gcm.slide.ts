import {Component} from '@angular/core'
import { isNil } from 'lodash'
import {CmiDataService} from '../../services/cmi-data.service'
import {Formats} from '../../../../../template-module/src/lib/pipes/table-value.pipe'

@Component({
  selector: 'audio-performance-overview-gcm',
  templateUrl: './audio-performance-overview-gcm.slide.html',
  styleUrls: ['./audio-performance-overview-gcm.slide.less']
})
export class AudioPerformanceOverviewGcmSlide {
  loading = true
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was heard'},
    {metric: 'pct_completions100', name_1: 'Completion Rate', format: 'percent', description: 'Percentage of your audio message that was listened to completion'},
  ]
  footerMetrics = [
    {metric: 'video_and_overlay_clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your ad', classes: ['extra', 'border']},
    {metric: 'click_rate', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown', classes: ['extra']}
  ]

  constructor(dataService: CmiDataService) {
    dataService
      .mappedAudioAdvertisersCreative()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .filter(row => row.getSliceId('datasource') === 'google_campaign_manager')
            .map(row => ({
              id: row.getSliceId('creative'),
              name: row.getData('creative').creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.pct_completions100))
            .sort((a, b) => b.metrics.pct_completions100 - a.metrics.pct_completions100 || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
        }
        this.loading = false
    })
  }

  getFormatOptions(metric: string, format: Formats) {
    return format === Formats.PERCENT && metric === 'click_rate'
      ? '1.0-3'
      : {}
  }
}
