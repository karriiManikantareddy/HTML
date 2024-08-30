import {Component} from '@angular/core'
import {
  Metadata,
  RedVenturesDataService
} from '../../services/red-ventures-data.service';

@Component({
  selector: 'cover',
  styleUrls: ['./cover.slide.less'],
  templateUrl: './cover.slide.html',
})
export class CoverSlide {
  loading = false
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
