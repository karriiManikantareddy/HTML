import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'newsletter-cover',
  templateUrl: './newsletter-cover.slide.html',
  styleUrls: ['./newsletter-cover.slide.less']
})
export class NewsletterCoverSlide {
  loading = true
  hasNewsletter: boolean
  metadata?: Metadata

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasNewsletter(),
    ]).subscribe(([metadata, hasNewsletter]) => {
        this.loading = false
        this.hasNewsletter = hasNewsletter
        this.metadata = metadata
      })
  }
}
