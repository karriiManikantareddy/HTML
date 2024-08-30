import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {RedVenturesDataService} from '../../services/red-ventures-data.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading = true
  totals: any
  chartSeries: any[]

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

  legendItems: any[] = []

  constructor(
    dataService: RedVenturesDataService,
  ) {
    combineLatest([
      dataService.totals(),
      dataService.series(),
    ])
    .subscribe(([totals, series]) => {
      this.loading = false
      this.totals = totals
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name == 'billable_impressions') {
            return Object.add(s, {
              color: '#000',
            })
          } else if (name == '1p_ctr') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: '#ccc',
            })
          }
      })
      if (this.totals && this.totals.billable_impressions) {
        this.legendItems.push({name: this.totals.billable_impressions.displayName, color: '#000'})
      }
      if (this.totals && this.totals['1p_ctr']) {
        this.legendItems.push({name: this.totals['1p_ctr'].displayName, color: '#ccc'})
      }
    })
  }
}
