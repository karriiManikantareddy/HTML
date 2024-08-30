import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Ad} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'social-ads',
  templateUrl: './social-ads.slide.html',
  styleUrls: ['./social-ads.slide.less']
})
export class SocialAdsSlide {
  loading = true
  hasSocial: boolean
  ads?: Ad[]

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.socialAds(),
      dataService.hasSocial(),
    ]).subscribe(([ads, hasSocial]) => {
        this.loading = false
        this.hasSocial = hasSocial
        this.ads = ads
          .sortBy(c => -c.metrics.link_clicks_ctr.value)
          .slice(0, 5)
      })
  }
}
