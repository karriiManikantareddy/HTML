import {Component} from '@angular/core'
import {StandardDataService} from '../../services/standard-data.service'
import {TraderVariables} from '../../variables'
import {combineLatest} from 'rxjs'

@Component({
  selector: 'social-performance',
  templateUrl: './social-performance.slide.html',
  styleUrls: ['./social-performance.slide.less']
})
export class SocialPerformanceSlide {
  loading = true
  totals: any
  chartSeries: any[]
  legendItems: any[] = []

  chartOptions = {
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function() {
          return Date.create(this.value).format('{Mon} {date}')
        }
      }
    },
    yAxis: [
      {},
      {
        title: null,
        opposite: true,
        labels: {
          formatter: function() {
            return `${(this.value * 100).round(3)}%`
          }
        }
      }
    ]
  }

  constructor (
    dataService: StandardDataService,
    variables: TraderVariables,
  ) {
    combineLatest([
      dataService.fbTotals(),
      dataService.fbSeries(),
    ])
    .subscribe(([totals, series]) => {
      this.loading = false
      this.totals = totals
      this.chartSeries = series.map(s => {
        const name = s['name']
        if (name == 'impressions') {
          return Object.add(s, {
            color: variables.colors.light_blue
          })
        } else if (name == 'vcr') {
          return Object.add(s, {
            type: 'line',
            yAxis: 1,
            color: variables.colors.dark_blue,
          })
        }
      })
      if (this.totals && this.totals.impressions) {
        this.legendItems.push({name: "Total Impressions", color: variables.colors.light_blue})
      }
      if (this.totals && this.totals.vcr) {
        this.legendItems.push({name: 'VCR', color: variables.colors.dark_blue})
      }
    })
  }
}
