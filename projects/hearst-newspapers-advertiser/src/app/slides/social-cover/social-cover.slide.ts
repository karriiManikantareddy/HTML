import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'social-cover',
  templateUrl: './social-cover.slide.html',
  styleUrls: ['./social-cover.slide.less']
})
export class SocialCover {
  loading = true
  metadata?: Metadata
  hasSocial: boolean

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasSocial(),
    ]).subscribe(([metadata, hasSocial]) => {
      this.loading = false
      this.metadata = metadata
      this.hasSocial = hasSocial
    })
  }
}
