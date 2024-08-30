import {Component} from '@angular/core'
import { Metadata, RedVenturesDataService } from '../../services/red-ventures-data.service'

@Component({
  selector: 'learnings',
  styleUrls: ['./learnings.slide.less'],
  templateUrl: './learnings.slide.html',
})
export class LearningsSlide {
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
