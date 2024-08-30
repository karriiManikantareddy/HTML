import {Component, Input} from '@angular/core'
import {NytDataService, LineItem} from '../../services/nyt-data.service'


@Component({
  selector: 'native-dsm-line-items',
  templateUrl: './native-dsm-line-items.slide.html'
})
export class NativeDsmLineItemsSlide {
  loading = true
  lineItemGroups: LineItem[][] = []
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(dataService: NytDataService) {
    dataService.nativeNonDFPLineItems().subscribe(lineItems => {
      this.loading = false
      this.lineItemGroups = lineItems
        .inGroupsOf(8)
        .map('compact')
    })
  }
}
