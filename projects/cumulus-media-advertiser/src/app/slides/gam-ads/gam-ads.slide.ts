import {Component} from '@angular/core'
import {CumulusMediaDataService, GamAd} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'gam-ads',
  templateUrl: './gam-ads.slide.html',
  styleUrls: ['./gam-ads.slide.less']
})
export class GamAdsSlide {
  loading = true
  ads?: GamAd[]
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    dataService
      .gamAds()
      .subscribe(ads => {
        this.loading = false
        this.empty = !ads.length
        this.ads = ads
          .sortBy(c => -c.metrics.ctr.value)
          .slice(0, 5)
      })
  }
}
