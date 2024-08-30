import {Component} from '@angular/core'
import {CbsiDataService, Metadata} from '../../services/cbsi-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata: Metadata

  constructor(dataService: CbsiDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
