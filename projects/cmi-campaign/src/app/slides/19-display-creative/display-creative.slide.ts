import { Component } from '@angular/core'
import { CmiDataService } from '../../services/cmi-data.service'

@Component({
  selector: 'display-creative',
  templateUrl: './display-creative.slide.html',
  styleUrls: ['./display-creative.slide.less']
})
export class DisplayCreativeSlide {
  loading = false
  hasAed = false

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
  }
}
