import {Component} from '@angular/core'
import {CumulusMediaDataService, SocialAd} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'social-ads',
  templateUrl: './social-ads.slide.html',
  styleUrls: ['./social-ads.slide.less']
})
export class SocialAdsSlide {
  loading = true
  ads?: SocialAd[]
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    dataService
      .socialAds()
      .subscribe(ads => {
        this.empty = !ads.length
        this.loading = false
        this.ads = ads
          .sortBy(c => -c.metrics.link_click_ctr.value)
          .slice(0, 5)
      })
  }
}
