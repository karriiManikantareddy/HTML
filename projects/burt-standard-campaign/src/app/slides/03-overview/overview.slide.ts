import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {StandardDataService} from '../../services/standard-data.service'
import {TemplateConfigService} from '../../services/template-config.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading = true
  totals: any
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

  constructor(
    dataService: StandardDataService,
    variables: Variables,
    templateConfigService: TemplateConfigService
  ) {
    combineLatest([
      dataService.totals(),
      dataService.series(),
      templateConfigService.getTemplateConfigs()
    ])
    .subscribe(([totals, series, templateConfigs]) => {
      this.loading = false
      this.totals = totals
      this.chartSeries = series.map(s => {
          const name = s['name']
          if (name == 'total_line_item_level_impressions') {
            return Object.add(s, {
              color: (templateConfigs && templateConfigs.secondary_color) || variables.colors.impressions,
            })
          } else if (name == 'ctr') {
            return Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: (templateConfigs && templateConfigs.primary_color) || variables.colors.clicks,
            })
          }
      })
      if (this.totals && this.totals.total_line_item_level_impressions) {
        this.legendItems.push({name: this.totals.total_line_item_level_impressions.displayName, color: (templateConfigs && templateConfigs.secondary_color) || variables.colors.impressions})
      }
      if (this.totals && this.totals.ctr) {
        this.legendItems.push({name: this.totals.ctr.displayName, color: (templateConfigs && templateConfigs.primary_color) || variables.colors.clicks})
      }
    })
  }
}
