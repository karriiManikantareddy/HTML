import {Component, Input} from '@angular/core'
import {NytDataService, Metadata} from '../../services/nyt-data.service'


@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true;
  metadata?: Metadata;
  @Input() backgroundColor: string;

  constructor(dataService: NytDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
