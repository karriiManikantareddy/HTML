import {Component} from '@angular/core'
import { Metadata, RedVenturesDataService } from '../../services/red-ventures-data.service'

@Component({
  selector: 'top-performing-media',
  styleUrls: ['./top-performing-media.slide.less'],
  templateUrl: './top-performing-media.slide.html',
})
export class TopPerformingMediaSlide {
  loading: boolean = true
  metadata: Metadata

  constructor(dataService: RedVenturesDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
