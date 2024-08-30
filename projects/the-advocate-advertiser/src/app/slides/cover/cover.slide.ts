import {Component} from '@angular/core'
import {TheAdvocateDataService, Metadata} from '../../services/the-advocate-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading: boolean = true
  metadata?: Metadata
  logo: string = 'assets/img/LOGO-GeorgesMedia-Reverse.png'

  constructor(dataService: TheAdvocateDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
