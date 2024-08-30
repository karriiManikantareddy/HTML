import {Component} from '@angular/core'
import {MlbDataService, Metadata} from '../../services/mlb-data.service'

@Component({
  selector: 'mlb-tv-cover',
  templateUrl: './mlb-tv-cover.slide.html',
  styleUrls: ['./mlb-tv-cover.slide.less']
})
export class MlbTvCoverSlide {
  loading = true
  metadata?: Metadata

  constructor(dataService: MlbDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
