import {Component, Input} from '@angular/core'
import { NytDataService, Creative } from '../../services/nyt-data.service'
import { forkJoin } from 'rxjs'


@Component({
  selector: 'facebook-delivery',
  templateUrl: './facebook-delivery.slide.html',
  styleUrls: ['./facebook-delivery.slide.less'],
})
export class FacebookDeliverySlide {
  loading = true
  totals: Partial<Record<string, number>> = {}
  topCreative?: Creative
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(dataService: NytDataService) {
    forkJoin([
      dataService.nativeTotals(),
      dataService.nativeCreatives()
    ])
    .subscribe(([nativeTotals, nativeCreatives]) => {
      this.loading = false
      this.totals = nativeTotals
      this.topCreative = nativeCreatives
        .filter(c => c.metrics.fb_link_clicks)
        .sortBy(c => c.metrics.fb_link_clicks, true)
        .first()
    })
  }
}
