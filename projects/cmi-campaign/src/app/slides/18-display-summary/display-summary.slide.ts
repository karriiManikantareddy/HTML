import { Component } from '@angular/core'
import { CmiDataService } from '../../services/cmi-data.service'

@Component({
  selector: 'display-summary',
  templateUrl: './display-summary.slide.html',
  styleUrls: ['./display-summary.slide.less']
})
export class DisplaySummarySlide {
  loading = true
  hasAed = false
  impressions = 0
  clicks = 0
  ctr = 0

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
    dataService.displayTotal()
      .subscribe(({ impressions, clicks, ctr }) => {
        if (impressions) {
          this.impressions = impressions
          this.clicks = clicks
          this.ctr = ctr
        }
        this.loading = false
      })
  }
}
