import { Component } from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'dfp-creative',
  templateUrl: './dfp-creative.slide.html',
  styleUrls: ['./dfp-creative.slide.less']
})
export class DfpCreativeSlide {
  loading = false
  hasDFP = false
  images = {
    dfp_ad_size_1: '',
    dfp_ad_size_2: '',
    dfp_ad_size_3: ''
  }

  constructor(dataService: CmiDataService) {
    dataService.hasDFP().subscribe(hasDFP => this.hasDFP = hasDFP)
  }
}
