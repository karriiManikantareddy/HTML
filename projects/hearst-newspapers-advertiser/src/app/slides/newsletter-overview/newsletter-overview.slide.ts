import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'newsletter-overview',
  templateUrl: './newsletter-overview.slide.html',
  styleUrls: ['./newsletter-overview.slide.less']
})
export class NewsletterOverviewSlide {
  loading = true
  hasNewsletter: boolean
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
      dataService.newsletterTotals(),
      dataService.newsletterWeeklyTotals(),
      dataService.hasNewsletter(),
      settingsService.settingData('colorTheme'),
      ])
      .subscribe(([metadata, totals, weeklyTotals, hasNewsletter, colorTheme]) => {
        this.loading = false
        this.hasNewsletter = hasNewsletter
        this.metadata = metadata
        this.colorTheme = colorTheme['data']
        this.totals = totals
        this.chartSeries = weeklyTotals.map(s => {
            const name = s['name']
            if (name == 'impressions') {
              return Object.add(s, {
                type: 'line',
                color: this.colorTheme.primary_color,
              })
            } else if (name == 'ctr') {
              return Object.add(s, {
                type: 'line',
                yAxis: 1,
                color: this.colorTheme.secondary_color,
              })
            }
        }).compact()
        if (this.totals && this.totals.impressions) {
          this.legendItems.push({name: this.totals.impressions.displayName, color: this.colorTheme.primary_color})
        }
        if (this.totals && this.totals.ctr) {
          this.legendItems.push({name: this.totals.ctr.displayName, color: this.colorTheme.secondary_color})
        }
      })
  }
}
