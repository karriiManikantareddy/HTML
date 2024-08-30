import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'gam-cover',
  templateUrl: './gam-cover.slide.html',
  styleUrls: ['./gam-cover.slide.less']
})
export class GamCoverSlide {
  loading = true
  metadata?: Metadata
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    combineLatest([dataService.metadata(), dataService.gamTotals()])
      .subscribe(([metadata, totals]) => {
        this.empty = Object.keys(totals).length === 0
        this.loading = false
        this.metadata = metadata
      })
  }
}
