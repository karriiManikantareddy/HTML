import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {HearstMagazinesDataService} from '../../services/hearst-magazines-data.service'

@Component({
  selector: 'branded-content-overview',
  templateUrl: './branded-content-overview.slide.html',
  styleUrls: ['./branded-content-overview.slide.less']
})
export class BrandedContentOverview {
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
      {}
    ]
  }

  legendItems: any[] = []

  constructor(
    dataService: HearstMagazinesDataService,
    variables: Variables,
  ) {
    combineLatest([
      dataService.brandedContentTotals(),
      dataService.brandedContentSeries(),
    ])
    .subscribe(([totals, series]) => {
      this.loading = false
      this.totals = totals
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name == 'users') {
            return Object.add(s, {
              color: variables.colors.impressions,
            })
          } else if (name == 'pageviews') {
            return Object.add(s, {
              type: 'line',
              color: variables.colors.clicks,
            })
          }
      })
      if (this.totals && this.totals.users) {
        this.legendItems.push({name: this.totals.users.displayName, color: variables.colors.impressions})
      }
      if (this.totals && this.totals.pageviews) {
        this.legendItems.push({name: this.totals.pageviews.displayName, color: variables.colors.clicks})
      }
    })
  }
}
