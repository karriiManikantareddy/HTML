import {Component} from '@angular/core'
import { StandardDataService } from '../../services/standard-data.service'
import { combineLatest } from 'rxjs'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model'
import { TraderVariables } from '../../variables'


type seriesFormat = {
  data: any[],
  color: string
}

@Component({
  selector: 'media-performance',
  templateUrl: './media-performance.slide.html',
  styleUrls: ['./media-performance.slide.less']
})
export class MediaPerformanceSlide {
  loading = true
  chartSeries: ChartSeries[] = []
  totals: any
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

  constructor(
    dataService: StandardDataService,
    variables: TraderVariables,
  ) {
      combineLatest([
      dataService.dfpTotals(),
      dataService.dfpSeries(),
    ])
    .subscribe(([totals, series]) => {
      this.loading = false
      this.totals = totals
      this.chartSeries = series.map(s => {
        const name = s['name']
        if (name == 'total_line_item_level_impressions') {
          return Object.add(s, {
            color: variables.colors.light_blue
          })
        } else if (name == 'click_rate') {
          return Object.add(s, {
            type: 'line',
            yAxis: 1,
            color: variables.colors.dark_blue
          })
        }
      })
      if (this.totals && this.totals.total_line_item_level_impressions) {
        this.legendItems.push({name: "Total Page Impressions", color: variables.colors.light_blue})
      }
      if (this.totals && this.totals.click_rate) {
        this.legendItems.push({name: 'CTR', color: variables.colors.dark_blue})
      }
    })
  }
}
