import {combineLatest} from 'rxjs'
import {Component} from '@angular/core'
import {NprDataService, Metadata} from '../../services/npr-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'

@Component({
  selector: 'creative-delivery',
  templateUrl: './creative-delivery.slide.html',
  styleUrls: ['./creative-delivery.slide.less']
})
export class CreativeDelivery {
  loading = true
  metadata: Metadata
  chartSeries: ChartSeries[] = []

  chartOptions = {
    chart: {
      type: 'column',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      }
    },
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
      {
        title: null,
        reversedStacks: false,
        labels: {
          formatter: function f(this: {value: number}): string {
            return `${(this.value.toLocaleString('en-US'))}`
          }
        }
      }
    ],
    legend: {
      enabled: true,
      itemMarginTop: 20,
      symbolRadius: 0,
      x: 0,
      y: 0,
      itemStyle: {
        fontSize: '18px',
        fontWeight: 'light'
      }
    },
  }

  constructor(dataService: NprDataService) {
    combineLatest([
      dataService.cfrCampaign(),
      dataService.creatives(),
      dataService.creativeSeries()
    ])
    .subscribe(([metadata, creatives, creativeSeries]) => {
      this.loading = false

      if (!metadata) return
      this.metadata = metadata

      const series: any[] = creativeSeries
      for (let i = 0; i < creativeSeries.length; i++) {
        series[i].name = creatives[i].name
      }
      this.chartSeries = series
    })
  }
}