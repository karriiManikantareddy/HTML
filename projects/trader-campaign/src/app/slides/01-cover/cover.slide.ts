import {Component} from '@angular/core'
import {TraderDataService, Metadata} from '../../services/trader-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata: Metadata

  constructor(dataService: TraderDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        metadata.name = metadata.name.titleize()
        this.metadata = metadata
      })
  }
}
