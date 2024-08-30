import {Component} from '@angular/core'
import {CumulusMediaDataService, Metadata} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata?: Metadata

  constructor(dataService: CumulusMediaDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
