import { forkJoin } from 'rxjs'
import { Component } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'

@Component({
  selector: 'test1',
  templateUrl: './test1.slide.html',
  styleUrls: ['./test1.slide.less']
})
export class Test1Slide {
  daySeries: any[]
  dayOptions = {
    xAxis: [{
      type: 'datetime',
      labels: {
        formatter: function() {
          return Date.create(this.value).setUTC(true).format('{Mon} {d}')
        },
        style: {
          color: '#949497'
        }
      }
    }]
  }

  constructor(dataService: DataService) {
    forkJoin([
      dataService.load('dfp_campaign'),
      dataService.load('dfp_campaign_per_day'),
    ]).subscribe(([data, dataPerDay]) => {
      this.daySeries = this.toDaySeries(dataPerDay)
    })
  }

  private toDaySeries(response) {
    return response['series'].map(ss => {
      return ss['metrics'].map(metric => {
        const data = response['timestamps'].map((t, i) => [t * 1000, metric['values'][i]])
        return {
          data: data
        }
      })
    }).flatten()
  }
}
