import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Link} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'email-links',
  templateUrl: './email-links.slide.html',
  styleUrls: ['./email-links.slide.less']
})
export class EmailLinksSlide {
  loading = true
  hasEmail: boolean
  links?: Link[]

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.emailLinks(),
      dataService.hasEmail(),
    ]).subscribe(([links, hasEmail]) => {
        this.loading = false
        this.hasEmail = hasEmail
        this.links = links
          .sortBy(c => -c.metrics.clicks.value)
          .slice(0, 5)
      })
  }
}
