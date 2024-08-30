import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, EmailAd} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'email-ads',
  templateUrl: './email-ads.slide.html',
  styleUrls: ['./email-ads.slide.less']
})
export class EmailAdsSlide {
  loading = true
  hasEmail: boolean
  ads?: EmailAd[]

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.emailAds(),
      dataService.hasEmail(),
    ]).subscribe(([ads, hasEmail]) => {
        this.loading = false
        this.hasEmail = hasEmail
        this.ads = ads
          .sortBy(c => -c.metrics.records.value)
          .slice(0, 5)
      })
  }
}
