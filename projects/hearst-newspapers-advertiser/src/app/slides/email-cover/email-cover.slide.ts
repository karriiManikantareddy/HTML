import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'email-cover',
  templateUrl: './email-cover.slide.html',
  styleUrls: ['./email-cover.slide.less']
})
export class EmailCover {
  loading = true
  hasEmail: boolean
  metadata?: Metadata

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasEmail(),
    ]).subscribe(([metadata, hasEmail]) => {
      this.loading = false
      this.hasEmail = hasEmail
      this.metadata = metadata
    })
  }
}
