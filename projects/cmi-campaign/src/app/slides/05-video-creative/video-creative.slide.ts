import { Component } from '@angular/core'
import { CmiDataService } from '../../services/cmi-data.service'

@Component({
  selector: 'video-creative',
  templateUrl: './video-creative.slide.html',
  styleUrls: ['./video-creative.slide.less']
})
export class VideoCreativeSlide {
  loading = false
  hasAEV = false

  constructor(dataService: CmiDataService) {
    dataService.hasAEV().subscribe(hasAEV => this.hasAEV = hasAEV)
  }
}
