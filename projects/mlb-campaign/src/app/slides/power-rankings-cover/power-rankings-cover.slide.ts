import {Component} from '@angular/core'
import {MlbDataService, Metadata} from '../../services/mlb-data.service'

@Component({
  selector: 'power-rankings-cover',
  templateUrl: './power-rankings-cover.slide.html',
  styleUrls: ['./power-rankings-cover.slide.less']
})
export class PowerRankingsCoverSlide {
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
