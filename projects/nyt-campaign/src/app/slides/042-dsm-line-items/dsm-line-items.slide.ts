import {Component} from '@angular/core'
import {NytDataService, LineItem} from '../../services/nyt-data.service'

@Component({
  selector: 'dsm-line-items',
  templateUrl: './dsm-line-items.slide.html'
})
export class DsmLineItemsSlide {
  loading = true
  lineItemGroups: LineItem[][] = []

  constructor(dataService: NytDataService) {
    dataService.nonDFPLineItems().subscribe(lineItems => {
      this.loading = false
      this.lineItemGroups = lineItems
        .inGroupsOf(8)
        .map('compact')
    })
  }
}
