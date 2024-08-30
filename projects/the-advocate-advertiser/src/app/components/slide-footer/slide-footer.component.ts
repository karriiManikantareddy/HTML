import { Component, Input } from '@angular/core'
import {TheAdvocateDataService, Metadata} from '../../services/the-advocate-data.service'

@Component({
  selector: 'slide-footer',
  templateUrl: './slide-footer.component.html',
  styleUrls: ['./slide-footer.component.less']
})
export class SlideFooterComponent {
  @Input() loading: boolean = true
  @Input() text: string
  metadata?: Metadata

  constructor(dataService: TheAdvocateDataService) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
  }
}
