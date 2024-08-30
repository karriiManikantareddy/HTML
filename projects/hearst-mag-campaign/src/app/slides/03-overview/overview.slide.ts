import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {HearstMagazinesDataService} from '../../services/hearst-magazines-data.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading = true
  totals: any
  socialTotals: any
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
      dataService.totals(),
      dataService.series(),
      dataService.socialTotals(),
    ])
    .subscribe(([totals, series, socialTotals]) => {
      this.loading = false
      this.totals = totals
      this.socialTotals = socialTotals
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name == 'third_party_impressions') {
            return Object.add(s, {
              type: 'line',
              color: variables.colors.impressions,
            })
          } else if (name == 'first_party_impressions') {
            return Object.add(s, {
              type: 'line',
              color: variables.colors.clicks,
            })
          }
      })
      if (this.totals && this.totals.third_party_impressions) {
        this.legendItems.push({name: this.totals.third_party_impressions.displayName, color: variables.colors.impressions})
      }
      if (this.totals && this.totals.first_party_impressions) {
        this.legendItems.push({name: this.totals.first_party_impressions.displayName, color: variables.colors.clicks})
      }
    })
  }
}
