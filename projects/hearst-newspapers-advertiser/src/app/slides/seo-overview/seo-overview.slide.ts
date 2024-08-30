import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'seo-overview',
  templateUrl: './seo-overview.slide.html',
  styleUrls: ['./seo-overview.slide.less']
})
export class SeoOverviewSlide {
  loading = true
  hasSeo: boolean
  metadata?: Metadata
  totals: Partial<Readonly<Record<string, MetricValue>>>
  chartOptions = {
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function() {
          return Date.create(this.value).format('{Mon}')
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
      dataService.seoTotals(),
      dataService.seoMonthlyTotals(),
      dataService.hasSeo(),
      settingsService.settingData('colorTheme'),
      ])
      .subscribe(([metadata, totals, monthlyTotals, hasSeo, colorTheme]) => {
        this.loading = false
        this.hasSeo = hasSeo
        this.metadata = metadata
        this.colorTheme = colorTheme['data']
        this.totals = totals
        this.chartSeries = monthlyTotals.map(s => {
            const name = s['name']
            if (name == 'rankingmin') {
              return Object.add(s, {
                type: 'line',
                color: this.colorTheme.primary_color,
              })
            } else if (name == 'reported_ranking_improvement') {
              return Object.add(s, {
                type: 'line',
                yAxis: 1,
                color: this.colorTheme.secondary_color,
              })
            }
        }).compact()
        if (this.totals && this.totals.rankingmin) {
          this.legendItems.push({name: this.totals.rankingmin.displayName, color: this.colorTheme.primary_color})
        }
        if (this.totals && this.totals.reported_ranking_improvement) {
          this.legendItems.push({name: this.totals.reported_ranking_improvement.displayName, color: this.colorTheme.secondary_color})
        }
      })
  }
}
