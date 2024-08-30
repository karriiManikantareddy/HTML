import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'social-overview',
  templateUrl: './social-overview.slide.html',
  styleUrls: ['./social-overview.slide.less']
})
export class SocialOverviewSlide {
  loading = true
  hasSocial: boolean
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
      {
        opposite: true,
      }
    ]
  }
  chartSeriesLeft: any[]
  chartSeriesRight: any[]
  legendItemsLeft: any[] = []
  legendItemsRight: any[] = []
  colorTheme: ColorTheme


  constructor(
    dataService: HearstNewspapersDataService,
    settingsService: HearstNewspapersSettingsService,
    ) {
    combineLatest([
      dataService.metadata(),
      dataService.socialTotals(),
      dataService.socialAdvertiserByWeek(),
      dataService.hasSocial(),
      settingsService.settingData('colorTheme'),
    ]).subscribe(([metadata, totals, advertiserByWeek, hasSocial, colorTheme]) => {
      this.hasSocial = hasSocial
      this.loading = false
      this.metadata = metadata
      this.colorTheme = colorTheme['data']
      this.totals = totals
      this.chartSeriesLeft = advertiserByWeek.map(s => {
          const name = s['name']
          if (name == 'link_clicks') {
            return Object.add(s, {
              type: 'line',
              color: this.colorTheme.primary_color,
            })
          } else if (name == 'link_clicks_ctr') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: this.colorTheme.secondary_color,
            })
          }
      }).compact()
      if (this.totals && this.totals.link_clicks) {
        this.legendItemsLeft.push({name: this.totals.link_clicks.displayName, color: this.colorTheme.primary_color})
      }
      if (this.totals && this.totals.link_clicks_ctr) {
        this.legendItemsLeft.push({name: this.totals.link_clicks_ctr.displayName, color: this.colorTheme.secondary_color})
      }
      this.chartSeriesRight = advertiserByWeek.map(s => {
          const name = s['name']
          if (name == 'impressions') {
            return Object.add(s, {
              type: 'line',
              color: this.colorTheme.primary_color,
            })
          } else if (name == 'landing_page_views') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: this.colorTheme.secondary_color,
            })
          }
      }).compact()
      if (this.totals && this.totals.impressions) {
        this.legendItemsRight.push({name: this.totals.impressions.displayName, color: this.colorTheme.primary_color})
      }
      if (this.totals && this.totals.landing_page_views) {
        this.legendItemsRight.push({name: this.totals.landing_page_views.displayName, color: this.colorTheme.secondary_color})
      }
    })
  }
}
