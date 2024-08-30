import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, EmailAd} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'email-screenshots',
  templateUrl: './email-screenshots.slide.html',
  styleUrls: ['./email-screenshots.slide.less']
})
export class EmailScreenshotsSlide {
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
        .filter(c => c.screenshot !== 'n/a')
        .sortBy(c => -c.metrics.records.value)
        .slice(0, 4)
      })
  }
}
