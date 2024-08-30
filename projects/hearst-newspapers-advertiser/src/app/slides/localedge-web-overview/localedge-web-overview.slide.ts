import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'localedge-web-overview',
  templateUrl: './localedge-web-overview.slide.html',
  styleUrls: ['./localedge-web-overview.slide.less']
})
export class LocalEdgeWebOverviewSlide {
  loading = true
  hasLocalEdgeWeb: boolean
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
      dataService.localEdgeWebTotals(),
      dataService.localEdgeWebWeeklyTotals(),
      dataService.hasLocalEdgeWeb(),
      settingsService.settingData('colorTheme'),
      ])
      .subscribe(([metadata, totals, weeklyTotals, hasLocalEdgeWeb, colorTheme]) => {
        this.loading = false
        this.hasLocalEdgeWeb = hasLocalEdgeWeb
        this.metadata = metadata
        this.colorTheme = colorTheme['data']
        this.totals = totals
        this.chartSeries = weeklyTotals.map(s => {
            const name = s['name']
            if (name == 'pageviews') {
              return Object.add(s, {
                type: 'line',
                color: this.colorTheme.primary_color,
              })
            } else if (name == 'visits') {
              return Object.add(s, {
                type: 'line',
                yAxis: 1,
                color: this.colorTheme.secondary_color,
              })
            }
        }).compact()
        if (this.totals && this.totals.pageviews) {
          this.legendItems.push({name: this.totals.pageviews.displayName, color: this.colorTheme.primary_color})
        }
        if (this.totals && this.totals.visits) {
          this.legendItems.push({name: this.totals.visits.displayName, color: this.colorTheme.secondary_color})
        }
      })
  }
}
