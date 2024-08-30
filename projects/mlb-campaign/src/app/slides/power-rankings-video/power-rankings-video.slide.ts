import {Component} from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {MlbDataService, Metadata} from '../../services/mlb-data.service'

@Component({
  selector: 'power-rankings-video',
  templateUrl: './power-rankings-video.slide.html',
  styleUrls: ['./power-rankings-video.slide.less']
})
export class PowerRankingsVideoSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>

  constructor(dataService: MlbDataService) {
    dataService
      .totals()
      .subscribe(totals => {
        this.loading = false
        this.totals = totals
      })
  }
}
