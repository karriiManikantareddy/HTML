import { Component, Input } from '@angular/core'

import {NytDataService, Metadata} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {combineLatest} from 'rxjs'
import {NytSettingsService } from '../../services/nyt-settings.service'


@Component({
  selector: 'summary',
  templateUrl: './summary.slide.html',
  styleUrls: ['./summary.slide.less']
})
export class SummarySlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  chartOptions: any = {
    backgroundColor : {
      linearGradient : [400],
    },
    renderTo : 'container',
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function(this: {value: number}): string {
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
          formatter: function(this: {value: number}): string {
            return `${(this.value * 100).round(3)}%`
          }
        }
      }
    ]
  }
  displayChartSeries: ChartSeries[] = []
  nativeChartSeries: ChartSeries[] = []
  nativeTotals: Partial<Record<string, number>> = {}
  loading = true

  constructor(
    dataService: NytDataService,
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
    combineLatest([
      dataService.nativeTotals(),
      dataService.nativeSeries(),
      settingsService.settingData('colorTheme'),
    ])
    .subscribe(([nativeTotals, nativeSeries, theme]) => {
      this.loading = false
      const colors = variables.colors.themes[theme.data]
      this.nativeTotals = nativeTotals
      this.nativeChartSeries = nativeSeries
        .filter(s => s.name == 'ga_pageviews')
        .map(s => <ChartSeries> Object.add(s, {
          color: colors.primary
        }))
      this.displayChartSeries = nativeSeries
        .filter(s => s.name == 'dfp_total_line_item_level_impressions')
        .map(s => <ChartSeries> Object.add(s, {
          color: colors.secondary
        }))

      this.chartOptions.backgroundColor.stops = [
        [0, colors.secondary],
        [1, 'rgb(16, 16, 16)'],
      ]
    })
  }
}
