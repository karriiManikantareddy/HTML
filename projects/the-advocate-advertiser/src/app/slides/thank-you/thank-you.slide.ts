import { Component } from '@angular/core'
import { TheAdvocateDataService, Metadata } from '../../services/the-advocate-data.service'

@Component({
  selector: 'thank-you',
  templateUrl: './thank-you.slide.html',
  styleUrls: ['./thank-you.slide.less']
})
export class ThankYouSlide {
  loading: boolean = false
  metadata?: Metadata
  logo: string = 'assets/img/LOGO-GeorgesMedia-Reverse.png'

  constructor(dataService: TheAdvocateDataService) {
    dataService.metadata().subscribe(metadata => this.metadata = metadata)
  }
}
