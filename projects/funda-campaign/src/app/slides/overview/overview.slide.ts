import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {FundaVariables} from '../../variables'
import {FundaDataService, Metadata} from '../../services/funda-data.service'
import {SettingsService} from '../../services/settings.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading = true
  totals: any
  metadata: Metadata
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

  currencyOptions = {
    currency: 'EUR',
  }

  legendItems: any[]
  templateType: string = 'consumers';

  constructor(
    dataService: FundaDataService,
    variables: FundaVariables,
    settingsService: SettingsService
  ) {
    combineLatest([
      dataService.dfpTotals(),
      dataService.dfpSeries(),
      dataService.dfpCampaign(),
      settingsService.settingData('template-type')
    ])
    .subscribe(([totals, series, metadata, templateType]) => {
      this.loading = false
      this.totals = totals
      this.metadata = metadata
      this.templateType = templateType && templateType.data;
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name == 'dfp_total_line_item_level_impressions') {
            return Object.add(s, {
              color: variables.colors[templateType.data].impressions,
            })
          } else if (name == 'ctr') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: variables.colors[templateType.data].ctr,
            })
          }
      })
      this.legendItems = [
        {name: 'impressions', color: variables.colors[templateType.data].impressions},
        {name: 'ctr', color: variables.colors[templateType.data].ctr},
      ]
    })
  }
}
