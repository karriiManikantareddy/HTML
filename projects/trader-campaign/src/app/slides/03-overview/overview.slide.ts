import {forkJoin} from 'rxjs'
import {Component, Input} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {TraderDataService} from '../../services/trader-data.service'

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

  legendItems: any[]

  constructor(dataService: TraderDataService, variables: Variables) {
    forkJoin([
      dataService.totals(),
      dataService.series(),
      dataService.lineItems(),
    ])
    .subscribe(([totals, series, lineItems]) => {
      this.loading = false
      this.totals = totals
      this.totals.contractedUnits = lineItems.sum('contractedUnits')
      this.totals.deliveredRate = this.totals.total_line_item_level_impressions / (this.totals.contractedUnits || 1)
      this.totals.ecpm = this.totals.total_line_item_level_all_revenue / this.totals.total_line_item_level_impressions * 1000
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name == 'total_line_item_level_impressions') {
            return Object.add(s, {
              color: variables.colors.impressions,
            })
          } else if (name == 'click_rate') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: variables.colors.clicks,
            })
          }
      })
    })

    this.legendItems = [
      {name: 'impressions', color: variables.colors.impressions},
      {name: 'CTR', color: variables.colors.clicks},
    ]
  }
}
