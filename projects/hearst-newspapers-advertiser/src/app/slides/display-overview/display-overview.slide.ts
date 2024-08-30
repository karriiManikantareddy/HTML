import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { Variables } from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { HearstNewspapersDataService, Metadata } from '../../services/hearst-newspapers-data.service'
import { HearstNewspapersSettingsService, ColorTheme } from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'display-overview',
  templateUrl: './display-overview.slide.html',
  styleUrls: ['./display-overview.slide.less']
})
export class DisplayOverviewSlide {
  loading = true
  hasDisplay: boolean
  metadata?: Metadata
  totals: Partial<Readonly<Record<string, MetricValue>>>
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
  chartSeries: any[]
  legendItems: any[] = []
  colorTheme: ColorTheme

  constructor(
    dataService: HearstNewspapersDataService,
    settingsService: HearstNewspapersSettingsService,
  ) {
    combineLatest([
      dataService.metadata(),
      dataService.displayTotals(),
      dataService.displayWeeklyTotals(),
      dataService.hasDisplay(),
      settingsService.settingData('colorTheme'),
    ])
      .subscribe(([metadata, totals, weeklyTotals, hasDisplay, colorTheme]) => {
        this.loading = false
        this.hasDisplay = hasDisplay
        this.metadata = metadata
        this.colorTheme = colorTheme['data']
        this.totals = totals
        this.chartSeries = weeklyTotals.map(s => {
          const name = s['name']
          if (name == 'impressions') {
            return Object.add(s, {
              type: 'line',
              color: '#F9C70C',
            })
          } else if (name == 'ctr') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: '#033242',
            })
          }
        }).compact()
        if (this.totals && this.totals.impressions) {
          this.legendItems.push({ name: this.totals.impressions.displayName, color: '#F9C70C' })
        }
        if (this.totals && this.totals.ctr) {
          this.legendItems.push({ name: this.totals.ctr.displayName, color: '#033242' })
        }
      })
  }
}
