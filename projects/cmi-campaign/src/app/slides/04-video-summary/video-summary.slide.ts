import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs';
import { CmiDataService } from '../../services/cmi-data.service'
import { ChartSeries } from '../../../../../template-module/src/lib/services/result.model'

@Component({
  selector: 'video-summary',
  templateUrl: './video-summary.slide.html',
  styleUrls: ['./video-summary.slide.less']
})
export class VideoSummarySlide implements OnDestroy {
  loading = true
  hasAEV = false
  hasTVE = false
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
      data: [{ name: '', y: 1, color: '#BAC9D3' }]
    },
      {
      type: 'pie',
      name: 'background',
      size: '95%',
      data: [{ name: '', y: 1, color: '#FFFFFF' }]
    },
    {
      type: 'pie',
      name: 'VCR',
      size: '85%',
      innerSize: '70%',
      data: [
        { name: 'VCR', y: this.vcr, color: '#853275' },
        { name: '', y: 1 - this.vcr, color: '#455051' },
      ]
    }]
    subscribers: Subscription[] = []

  constructor(dataService: CmiDataService) {
    this.subscribers.push(dataService.hasAEV().subscribe(hasAEV => this.hasAEV = hasAEV))
    this.subscribers.push(dataService.hasTVE().subscribe(hasTVE => this.hasTVE = hasTVE))
    dataService
      .videoTotal()
      .subscribe(({ impressions, vcr }) => {
        if (impressions) {
          this.impressions = impressions
          this.vcr = vcr
          let donutSeries = this.chartSeries.pop()
          donutSeries = {... donutSeries, data: [
            { name: 'VCR', y: this.vcr, color: '#853275' },
            { name: '', y: 1 - this.vcr, color: '#455051' },
          ]}
          this.chartSeries = [...this.chartSeries, donutSeries]
        }
        this.loading = false
      })
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => subscriber.unsubscribe());
  }
}
