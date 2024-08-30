import {Component} from '@angular/core'
import {EwScrippsDataService, Metadata} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata?: Metadata
  logo: string = 'assets/img/lighthouse.png'

  constructor(dataService: EwScrippsDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
        if (metadata && metadata.station) {
          this.logo = 'assets/img/stations/' + metadata.station + '.png'
        }
      })
  }
}
