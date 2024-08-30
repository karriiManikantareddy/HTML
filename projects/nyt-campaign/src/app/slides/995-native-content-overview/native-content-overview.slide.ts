import {combineLatest} from 'rxjs'
import {Component, Input} from '@angular/core'
import {NytDataService, Metadata} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import { NytSettingsService } from '../../services/nyt-settings.service'


@Component({
  selector: 'native-content-overview',
  templateUrl: './native-content-overview.slide.html',
  styleUrls: ['./native-content-overview.slide.less']
})
export class NativeContentOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, number>>> = {}
  chartSeries: ChartSeries[] = []
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  chartOptions = {
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function(this: {value: number}) {
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

  legendItems: {name: string, color: string}[]

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
    .subscribe(([totals, series, theme]) => {
      this.loading = false
      this.totals = totals
      const colors = variables.colors.themes[theme.data]
      this.chartSeries = series.map(s => {
          if (s.name === 'dfp_total_line_item_level_impressions') {
            return <ChartSeries> Object.add(s, {
              color: colors.secondary
            })
          } else if (s.name === 'dfp_ctr') {
            return <ChartSeries> Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: colors.primary
            })
          } else {
            return s
          }
      })
      this.legendItems = [
        {name: 'impressions', color: colors.secondary},
        {name: 'ctr', color: colors.primary},
      ]
    })
  }
}
