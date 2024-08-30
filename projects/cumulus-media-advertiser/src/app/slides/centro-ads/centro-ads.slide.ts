import {Component} from '@angular/core'
import {CumulusMediaDataService, CentroAd} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'centro-ads',
  templateUrl: './centro-ads.slide.html',
  styleUrls: ['./centro-ads.slide.less']
})
export class CentroAdsSlide {
  loading = true
  ads?: CentroAd[]
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    dataService
      .centroAds()
      .subscribe(ads => {
        this.empty = !ads.length
        this.loading = false
        this.ads = ads
          .sortBy(c => -c.metrics.ctr.value)
          .slice(0, 5)
      })
  }
}
