import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'sem-cover',
  templateUrl: './sem-cover.slide.html',
  styleUrls: ['./sem-cover.slide.less']
})
export class SemCover {
  loading = true
  metadata?: Metadata
  hasSem: boolean

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasSem(),
    ]).subscribe(([metadata, hasSem]) => {
      this.loading = false
      this.hasSem = hasSem
      this.metadata = metadata
    })
  }
}
