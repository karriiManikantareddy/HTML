import {Component} from '@angular/core'
import {HearstMagazinesDataService, LineItem} from '../../services/hearst-magazines-data.service'

@Component({
  selector: 'line-items',
  templateUrl: './line-items.slide.html',
  styleUrls: ['./line-items.slide.less']
})
export class LineItemsSlide {
  loading = true
  lineItemGroups: LineItem[][]
  metrics: any

  constructor(dataService: HearstMagazinesDataService) {
    dataService.lineItems().subscribe(lineItems => {
      this.loading = false
      if (!lineItems || !lineItems.length) return
      this.metrics = lineItems[0].metrics
      this.lineItemGroups = lineItems
        .sortBy('metrics.first_party_impressions.value', true)
        .inGroupsOf(5)
        .map('compact')
    })
  }
}
