import {Component} from '@angular/core'
import {EwScrippsDataService, Metadata} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'thank-you',
  templateUrl: './thank-you.slide.html',
  styleUrls: ['./thank-you.slide.less']
})
export class ThankYouSlide {
  loading = false
  metadata?: Metadata

  constructor(dataService: EwScrippsDataService) {
    dataService.metadata().subscribe(metadata => this.metadata = metadata)
  }
}
