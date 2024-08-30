import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'seo-cover',
  templateUrl: './seo-cover.slide.html',
  styleUrls: ['./seo-cover.slide.less']
})
export class SeoCoverSlide {
  loading = true
  hasSeo: boolean
  metadata?: Metadata

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.metadata(),
      dataService.hasSeo(),
    ]).subscribe(([metadata, hasSeo]) => {
        this.loading = false
        this.hasSeo = hasSeo
        this.metadata = metadata
      })
  }
}
