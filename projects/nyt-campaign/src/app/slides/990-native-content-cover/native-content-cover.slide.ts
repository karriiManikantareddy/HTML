import {Component, Input} from '@angular/core'
import {NytDataService, Metadata} from '../../services/nyt-data.service'
import { forkJoin } from 'rxjs';


@Component({
  selector: 'native-content-cover',
  templateUrl: './native-content-cover.slide.html',
  styleUrls: ['./native-content-cover.slide.less']
})

export class NativeContentCoverSlide {
  loading = true
  metadata?: Metadata

  nativeTotals: Partial<Record<string, number>> = {}
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(dataService: NytDataService) {
    forkJoin([
      dataService.metadata(),
      dataService.nativeTotals()
    ])
    .subscribe(([metadata, nativeTotals]) => {
      this.loading = false
      this.metadata = metadata
      this.nativeTotals = nativeTotals
    })
  }
}
