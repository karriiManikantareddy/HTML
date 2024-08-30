import {Component} from '@angular/core'
import {SimplifiDataService, Metadata} from '../../services/simplifi-data.service'

@Component({
  selector: 'thank-you',
  templateUrl: './thank-you.slide.html',
  styleUrls: ['./thank-you.slide.less']
})
export class ThankYouSlide {
  loading = false
  metadata?: Metadata

  constructor(dataService: SimplifiDataService) {
    dataService.metadata().subscribe(metadata => this.metadata = metadata)
  }
}
