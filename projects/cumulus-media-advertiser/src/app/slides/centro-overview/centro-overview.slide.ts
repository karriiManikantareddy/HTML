import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'centro-overview',
  templateUrl: './centro-overview.slide.html',
  styleUrls: ['./centro-overview.slide.less']
})
export class CentroOverviewSlide {
  loading = true
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
      {}
    ]
  }
  chartSeriesLeft: any[]
  chartSeriesRight: any[]
  empty: boolean = false

  constructor(
    dataService: CumulusMediaDataService,
    variables: Variables,
    ) {
    combineLatest([dataService.metadata(), dataService.centroTotals(), dataService.centroAdvertiserByWeek()])
      .subscribe(([metadata, totals, advertiserByWeek]) => {
        this.empty = Object.keys(totals).length === 0
        this.loading = false
        this.metadata = metadata
        this.totals = totals
        this.chartSeriesLeft = advertiserByWeek.map(s => {
            const name = s['name']
            if (name == 'impressions') {
              return Object.add(s, {
                color: '#EE3F33',
              })
            } else if (name == 'ctr') {
              return Object.add(s, {
                type: 'line',
                yAxis: 1,
                color: '#005A8E',
              })
            }
        }).compact()
        this.chartSeriesRight = advertiserByWeek.map(s => {
            const name = s['name']
            if (name == 'impressions') {
              return Object.add(s, {
                color: '#EE3F33',
              })
            } else if (name == 'total_conversions') {
              return Object.add(s, {
                type: 'line',
                color: '#005A8E',
              })
            }
        }).compact()
      })
  }
}
