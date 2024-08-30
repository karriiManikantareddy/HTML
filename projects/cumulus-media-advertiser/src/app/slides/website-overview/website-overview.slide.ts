import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'website-overview',
  templateUrl: './website-overview.slide.html',
  styleUrls: ['./website-overview.slide.less']
})
export class WebsiteOverviewSlide {
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
    combineLatest([dataService.metadata(), dataService.websiteTotals(), dataService.websiteByWeek()])
      .subscribe(([metadata, totals, advertiserByWeek]) => {
        this.empty = Object.keys(totals).length === 0
        this.loading = false
        this.metadata = metadata
        this.totals = totals
        this.chartSeriesLeft = advertiserByWeek.map(s => {
            const name = s['name']
            if (name == 'pageviews') {
              return Object.add(s, {
                type: 'line',
                color: '#F9C70C',
              })
            } else if (name == 'users') {
              return Object.add(s, {
                type: 'line',
                yAxis: 1,
                color: '#033242',
              })
            }
        }).compact()
        this.chartSeriesRight = advertiserByWeek.map(s => {
            const name = s['name']
            if (name == 'time_on_page') {
              return Object.add(s, {
                type: 'line',
                color: '#F9C70C',
              })
            } else if (name == 'users') {
              return Object.add(s, {
                type: 'line',
                yAxis: 1,
                color: '#033242',
              })
            }
        }).compact()
      })
  }
}
