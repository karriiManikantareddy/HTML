import { Component } from '@angular/core'
import {NprDataService, Metadata} from '../../services/npr-data.service'

@Component({
  selector: 'thank-you',
  templateUrl: './thank-you.slide.html',
  styleUrls: ['./thank-you.slide.less']

})
export class ThankYouSlide {
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
