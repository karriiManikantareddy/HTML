import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'sem-overview',
  templateUrl: './sem-overview.slide.html',
  styleUrls: ['./sem-overview.slide.less']
})
export class SemOverviewSlide {
  loading = true
  metadata?: Metadata
  totals: Partial<Readonly<Record<string, MetricValue>>>
  chartOptionsLeft = {
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
  chartOptionsRight = {
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
  chartSeriesLeft: any[]
  chartSeriesRight: any[]
  colorTheme: ColorTheme
  hasSem: boolean

  constructor(
    dataService: HearstNewspapersDataService,
    settingsService: HearstNewspapersSettingsService,
    ) {
    combineLatest([
      dataService.metadata(),
      dataService.semTotals(),
      dataService.semByWeek(),
      dataService.hasSem(),
      settingsService.settingData('colorTheme'),
    ]).subscribe(([metadata, totals, advertiserByWeek, hasSem, colorTheme]) => {
      this.loading = false
      this.metadata = metadata
      this.hasSem = hasSem
      this.totals = totals
      this.colorTheme = colorTheme['data']
      this.chartSeriesLeft = advertiserByWeek.map(s => {
          const name = s['name']
          if (name == 'cost') {
            return Object.add(s, {
              color: this.colorTheme.primary_color,
            })
          } else if (name == 'clicks') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: this.colorTheme.secondary_color,
            })
          }
      }).compact()
      this.chartSeriesRight = advertiserByWeek.map(s => {
          const name = s['name']
          if (name == 'click_rate') {
            return Object.add(s, {
              color: this.colorTheme.primary_color,
            })
          } else if (name == 'cpc') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: this.colorTheme.secondary_color,
            })
          }
      }).compact()
    })
  }
}
