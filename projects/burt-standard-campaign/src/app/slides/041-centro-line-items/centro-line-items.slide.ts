import {Component} from '@angular/core'
import {StandardDataService, LineItem} from '../../services/standard-data.service'

@Component({
  selector: 'centro-line-items',
  templateUrl: './centro-line-items.slide.html',
  styleUrls: ['./centro-line-items.slide.less']
})
export class CentroLineItemsSlide {
  loading = true
  lineItemGroups: LineItem[][]
  metrics: any

  constructor(dataService: StandardDataService) {
    dataService.centroLineItems().subscribe(lineItems => {
      this.loading = false
      if (!lineItems || !lineItems.length) return
      this.metrics = lineItems[0].metrics
      this.lineItemGroups = lineItems
        .sortBy('metrics.imps_won.value', true)
        .inGroupsOf(5)
        .map('compact')
    })
  }
}
