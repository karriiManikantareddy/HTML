import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'website-cover',
  templateUrl: './website-cover.slide.html',
  styleUrls: ['./website-cover.slide.less']
})
export class WebsiteCover {
  loading = true
  metadata?: Metadata
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    combineLatest([dataService.metadata(), dataService.websiteTotals()])
      .subscribe(([metadata, totals]) => {
        this.empty = Object.keys(totals).length === 0
        this.loading = false
        this.metadata = metadata
      })
  }
}
