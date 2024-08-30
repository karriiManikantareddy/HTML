import {Component} from '@angular/core'
import {NprDataService, Metadata} from '../../services/npr-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata: Metadata
  isWhiteFooter: boolean = true

  constructor(dataService: NprDataService) {
    dataService
      .cfrCampaign()
      .subscribe(metadata => {
        this.loading = false
        if (!metadata) return
        this.metadata = metadata
      })
  }
}