import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'display-cover',
  templateUrl: './display-cover.slide.html',
  styleUrls: ['./display-cover.slide.less']
})
export class DisplayCover {
  loading = true
  hasDisplay: boolean
  metadata?: Metadata

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasDisplay(),
    ]).subscribe(([metadata, hasDisplay]) => {
        this.loading = false
        this.hasDisplay = hasDisplay
        this.metadata = metadata
      })
  }
}
