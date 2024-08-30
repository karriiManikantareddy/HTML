import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'centro-cover',
  templateUrl: './centro-cover.slide.html',
  styleUrls: ['./centro-cover.slide.less']
})
export class CentroCoverSlide {
  loading = true
  metadata?: Metadata
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    combineLatest([dataService.metadata(), dataService.centroTotals()])
      .subscribe(([metadata, totals]) => {
        this.empty = Object.keys(totals).length === 0
        this.loading = false
        this.metadata = metadata
      })
  }
}
