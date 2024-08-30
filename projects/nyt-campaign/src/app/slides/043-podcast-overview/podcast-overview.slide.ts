import { Component, Input } from '@angular/core'
import {combineLatest} from 'rxjs'
import {NytDataService} from '../../services/nyt-data.service'


@Component({
  selector: 'podcast-overview',
  templateUrl: './podcast-overview.slide.html',
  styleUrls: ['./podcast-overview.slide.less'],
})
export class PodcastOverviewSlide {
  loading: boolean = true
  totals: any
  deliveryRate: number
  guaranteed: number
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(
    dataService: NytDataService
    ) {
    combineLatest([
      dataService.totals(),
      dataService.lineItems(),
    ])
    .subscribe(([totals, lineItems]) => {
      this.loading = false
      this.totals = totals
      this.guaranteed = lineItems.sum(li => li.bookedImpressions)
      this.deliveryRate = this.totals.aw_impressions / this.guaranteed
    })
  }
}
