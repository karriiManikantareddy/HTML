import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'paid-social-cover',
  templateUrl: './paid-social-cover.slide.html',
  styleUrls: ['./paid-social-cover.slide.less']
})
export class PaidSocialCover {
  loading = true
  metadata?: Metadata
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    combineLatest([dataService.metadata(), dataService.socialTotals()])
      .subscribe(([metadata, totals]) => {
        this.empty = Object.keys(totals).length === 0
        this.loading = false
        this.metadata = metadata
      })
  }
}
