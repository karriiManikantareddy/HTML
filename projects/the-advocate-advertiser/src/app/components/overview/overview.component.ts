import {Component, Input} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {ChartConfig} from '../../services/the-advocate-data.service'

@Component({
  selector: 'overview-cmp',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent {
  @Input() totals: Partial<Readonly<Record<string, MetricValue>>>
  @Input() series: any
  @Input() chartConfig: ChartConfig
  kpis: any[]
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
    yAxis: [{
      title: null,
    }],
    plotOptions: {
      series: {
        lineWidth: 3,
      }
    },
  }
  chartSeries: any[]
  percentFormat = {
    formatter: function() {
      return `${(this.value * 100).round(3)}%`
    }
  }
  percentMetrics: string[] = ['ctr', 'vcr', 'conversion_rate']
  legendItems: any[]
  formatOptions: any = {
    separatorName: 'comma',
  }

  constructor(private variables: Variables) {}

  ngOnChanges() {
    if (this.totals) {
      this.kpis = Object.values(this.totals)
    }
    if (this.series) {
      this.chartSeries = []
      this.legendItems = []
      const barSeries = this.series.find(s => s['name'] === this.chartConfig.barMetric)
      if (this.percentMetrics.includes(this.chartConfig.barMetric)) {
        this.chartOptions.yAxis[0]['labels'] = this.percentFormat
      }
      this.chartSeries.push(Object.add(barSeries, { color: this.variables.colors.primary }))
      this.legendItems.push({color: this.variables.colors.primary, name: this.getDisplayName(this.chartConfig.barMetric)})
      const lineSeries = this.series.filter(s => this.chartConfig.splines.includes(s['name']))
      lineSeries.forEach((s, i) => {
        let yAxis: any = { title: null, opposite: true}
        if (this.percentMetrics.includes(s['name'])) {
          yAxis['labels'] = this.percentFormat
        }
        this.chartOptions.yAxis.push(yAxis)
        this.chartSeries.push(Object.add(s, {
          type: 'spline',
          yAxis: (i + 1),
          color: this.variables.colors.chart[i],
        }))
        this.legendItems.push({color: this.variables.colors.chart[i], name: this.getDisplayName(s['name'])})
      })
    }
  }

  private getDisplayName(metric: string) {
    if (this.totals[metric]) {
      return this.totals[metric].displayName
    } else {
      return metric.capitalize()
    }
  }

  setFormatting(format: any): any {
    return Object.merge(this.formatOptions, format)
  }
}
