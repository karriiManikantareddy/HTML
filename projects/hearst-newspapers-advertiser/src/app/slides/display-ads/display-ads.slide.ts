import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Ad} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'display-ads',
  templateUrl: './display-ads.slide.html',
  styleUrls: ['./display-ads.slide.less']
})
export class DisplayAdsSlide {
  loading = true
  hasDisplay: boolean
  ads?: Ad[]

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.displayAds(),
      dataService.hasDisplay(),
    ]).subscribe(([ads, hasDisplay]) => {
        this.loading = false
        this.hasDisplay = hasDisplay
        this.ads = ads
          .sortBy(c => -c.metrics.ctr.value)
          .slice(0, 5)
      })
  }
}
