import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { StandardDataService } from '../../services/standard-data.service'

@Component({
  selector: 'video-performance',
  templateUrl: './video-performance.slide.html',
  styleUrls: ['./video-performance.slide.less']
})
export class VideoPerformanceSlide {
  loading: boolean = true
  fbTotals: any
  dfpTotals: any

  constructor (
    dataService: StandardDataService,
  ) {
    combineLatest([
      dataService.fbTotals(),
      dataService.dfpTotals(),
    ])
    .subscribe(([fbTotals, dfpTotals]) => {
      this.loading = false
      this.fbTotals = fbTotals
      this.dfpTotals = dfpTotals
    })
  }
}
