import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {AdevintaDataService} from '../../services/adevinta-data.service'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'overview-clicks',
  templateUrl: './overview-clicks.slide.html',
  styleUrls: ['./overview-clicks.slide.less']
})
export class OverviewClicksSlide {
  loading = true
  metrics: any
  revenue: any = null
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
  currency: {}

  constructor(
    dataService: AdevintaDataService,
    variables: Variables,
    settingsService: AdevintaSettingsService,
  ) {
    combineLatest([
      dataService.totals(),
      dataService.clickSeries(),
      settingsService.settingData('chartColor'),
    ])
    .subscribe(([totals, series, chartColor]) => {
      this.loading = false
      this.metrics = totals?.metrics;
      this.currency = { currency: totals?.entityCurrency?.toUpperCase() };

      if (!series || !series.length) { return }
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name === 'gam_impressions') {
            return Object.add(s, {
              color: variables.colors[chartColor.data].secondary,
            })
          } else if (name === 'ctr') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: variables.colors[chartColor.data].primary,
            })
          }
      })
      if (this.metrics && this.metrics.gam_impressions) {
        this.legendItems = [{name: 'Impressions', color: variables.colors[chartColor.data].secondary}];
      }
      if (this.metrics && this.metrics.ctr) {
        this.legendItems = [
          ...this.legendItems,
          {name: 'CTR', color: variables.colors[chartColor.data].primary},
        ]
      }
      if (this.metrics) {
        this.revenue = this.metrics.net_revenue_capped && this.metrics.net_revenue_capped.value ||
          this.metrics.gam_revenue && this.metrics.gam_revenue.value ||
          null
      }
    })
  }
}
