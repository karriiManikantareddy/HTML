import {Component} from '@angular/core'
import {HearstMagazinesDataService, Metadata} from '../../services/hearst-magazines-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata: Metadata

  constructor(dataService: HearstMagazinesDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        if (!metadata) return
        metadata.name = metadata.name && metadata.name.titleize()
        this.metadata = metadata
      })
  }
}
