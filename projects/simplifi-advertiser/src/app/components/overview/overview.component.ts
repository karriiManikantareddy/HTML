import {Component, Input} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {ChartConfig} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'overview-cmp',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent {
  @Input() totals: Partial<Readonly<Record<string, MetricValue>>>
  @Input() comparisons: Partial<Readonly<Record<string, MetricValue>>>
  @Input() series: any
  @Input() chartConfig: ChartConfig
  @Input() kpis: string[]
  @Input() gauge: boolean = false
  chartOptions = {
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function() {
          return Date.create(this.value).setUTC(true).format('{Mon} {date}')
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

  gaugeCharts = {}

  configs = {
    display_native_ctr: {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '80%'
      },
      pane: {
          startAngle: -90,
          endAngle: 89.9,
          background: null,
          center: ['50%', '75%'],
          size: '110%'
      },
      yAxis: [{
        minorTickLength: 0,
        tickLength: 0,
        labels: {
          enabled: false,
        },
        lineWidth: 0, 
        min: 0,
        max: 0.003,
        plotBands: [{
          from: 0,
          to: 0.0003,
          color: '#BF2200',
          thickness: '30%',
        }, {
          from: 0.0003,
          to: 0.0007,
          color: '#DF5353',
          thickness: '30%',
        },
        {
          from: 0.0007,
          to: 0.0012,
          color: '#DDDF0D',
          thickness: '30%',
        },
        {
          from: 0.0012,
          to: 0.002,
          color: '#55BF3B',
          thickness: '30%',
        },
        {
        from: 0.002,
        to: 0.003,
        color: '#05a107',
        thickness: '30%',
      }]
      }]
    },
    vcr: {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '80%'
      },
      pane: {
          startAngle: -90,
          endAngle: 89.9,
          background: null,
          center: ['50%', '75%'],
          size: '110%'
      },
      yAxis: [{
        minorTickLength: 0,
        tickLength: 0,
        labels: {
          enabled: false,
        },
        lineWidth: 0, 
        min: 0,
        max: 1,
        plotBands: [{
          from: 0,
          to: 0.55,
          color: '#BF2200',
          thickness: '30%',
        }, {
          from: 0.55,
          to: 0.75,
          color: '#DF5353',
          thickness: '30%',
        },
        {
          from: 0.75,
          to: 0.90,
          color: '#DDDF0D',
          thickness: '30%',
        },
        {
          from: 0.90,
          to: 0.95,
          color: '#55BF3B',
          thickness: '30%',
        },
        {
        from: 0.95,
        to: 1,
        color: '#05a107',
        thickness: '30%',
      }]
      }],
    },
    frequency: {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '80%'
      },
      pane: {
          startAngle: -90,
          endAngle: 89.9,
          background: null,
          center: ['50%', '75%'],
          size: '110%'
      },
      yAxis: [{
        minorTickLength: 0,
        tickLength: 0,
        labels: {
          enabled: false,
        },
        lineWidth: 0, 
        min: 1,
        max: 15,
        plotBands: [{
          from: 1,
          to: 3,
          color: '#DF5353',
          thickness: '30%',
        },
        {
          from: 3,
          to: 5,
          color: '#DDDF0D',
          thickness: '30%',
        },
        {
          from: 5,
          to: 9,
          color: '#55BF3B',
          thickness: '30%',
        },
        {
        from: 9,
        to: 30,
        color: '#05a107',
        thickness: '30%',
      }]
    }],
    }
  }

  chartSeries: any[]
  percentFormat = {
    formatter: function() {
      return `${(this.value * 100).round(3)}%`
    }
  }
  percentMetrics: string[] = ['display_native_ctr', 'vcr', 'conversion_rate']
  legendItems: any[]
  formatOptions: any = {
    separatorName: 'comma',
  }
  theme: string = 'light'
  primaryColor: string = '#E05534'
  splineMetric: string

  constructor(
    private variables: Variables,
    settingsService: SimplifiSettingsService,
  ) {
    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
    })
    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
      if (this.series) {
        this.renderChart()
      }
    })
  }

  ngOnChanges() {
    if (this.series) {
      this.renderChart()
    }
    if (this.totals) {
      ['display_native_ctr', 'vcr', 'frequency'].forEach(metric => {
        if (this.totals[metric]) {
          this.gaugeCharts[metric] = this.generateGaugeSeries(metric, this.totals[metric].value)
        }
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

  renderChart() {
    this.chartSeries = []
    this.legendItems = []
    const barSeries = this.series.find(s => s['name'] === this.chartConfig.barMetric)
    if (this.percentMetrics.includes(this.chartConfig.barMetric)) {
      this.chartOptions.yAxis[0]['labels'] = this.percentFormat
    }
    this.chartSeries.push(Object.add(barSeries, { color: this.variables.colors[this.theme].primary }))
    this.legendItems.push({color: this.variables.colors[this.theme].primary, name: this.getDisplayName(this.chartConfig.barMetric)})
    this.splineMetric = this.chartConfig.splines[0]
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
        color: this.primaryColor,
      }))
      this.legendItems.push({color: this.primaryColor, name: this.getDisplayName(s['name'])})
    })
  }

  private generateGaugeSeries(metric, value) {
    return [{
      data: [value],
      dataLabels: {
        formatter: function() {
          if (metric === 'frequency') {
            return `${this.y.round(2)}`
          } else {
            return `${(this.y * 100).round(2)}%`
          }
        },
        borderWidth: 0,
        color: '#333333',
        y: 50,
        style: {
            fontSize: '16px'
        }
      },
      dial: {
        radius: '60%',
        backgroundColor: 'gray',
        baseWidth: 12,
        baseLength: '0%',
        rearLength: '0%'
      },
    }]
  }
}
