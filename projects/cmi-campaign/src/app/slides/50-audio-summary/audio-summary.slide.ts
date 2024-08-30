import { Component } from '@angular/core'
import {combineLatest} from 'rxjs'
import { CmiDataService } from '../../services/cmi-data.service'
import { ChartSeries } from '../../../../../template-module/src/lib/services/result.model'

@Component({
  selector: 'audio-summary',
  templateUrl: './audio-summary.slide.html',
  styleUrls: ['./audio-summary.slide.less']
})
export class AudioSummarySlide {
  loading = true
  hasAudio = false
  impressions = 0
  vcr = 0
  chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: ''
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
        borderWidth: 0
      },
      series: {
        animation: false
      }
    },
    height: 250,
    width: 250
  }
  chartSeries: ChartSeries[] = [{
      type: 'pie',
      name: 'border',
      size: '100%',
      data: [{ name: '', y: 100, color: '#BAC9D3' }]
    },
      {
      type: 'pie',
      name: 'background',
      size: '95%',
      data: [{ name: '', y: 100, color: '#FFFFFF' }]
    },
    {
      type: 'pie',
      name: 'VCR',
      size: '85%',
      innerSize: '70%',
      data: [
        { name: 'VCR', y: this.vcr, color: '#c899c1' },
        { name: '', y: 100 - this.vcr, color: '#7b7c84' },
      ]
    }]

  constructor(dataService: CmiDataService) {
    combineLatest([
      dataService.mappedAudioAdvertisersCampaign(),
      dataService.hasAudio(),
    ]).subscribe(([campaignData, hasAudio]) => {
      this.hasAudio = hasAudio
      if (hasAudio) {
        this.impressions = campaignData.rows[0].getMetricValue('impressions')
        this.vcr = (campaignData.rows[0].getMetricValue('completions100') || 0) / this.impressions
        let donutSeries = this.chartSeries.pop()
        donutSeries = {... donutSeries, data: [
          { name: 'VCR', y: this.vcr, color: '#c899c1' },
          { name: '', y: 100 - this.vcr, color: '#7b7c84' },
        ]}
        this.chartSeries = [...this.chartSeries, donutSeries]
      }
      this.loading = false
    })
  }
}
