import {Component} from '@angular/core'
import {StandardDataService, LineItem} from '../../services/standard-data.service'

@Component({
  selector: 'line-items',
  templateUrl: './line-items.slide.html',
  styleUrls: ['./line-items.slide.less']
})
export class LineItemsSlide {
  loading = true
  lineItemGroups: LineItem[][]
  metrics: any

  constructor(dataService: StandardDataService) {
    dataService.lineItems().subscribe(lineItems => {
      this.loading = false
      if (!lineItems || !lineItems.length) return
      this.metrics = lineItems[0].metrics
      this.lineItemGroups = lineItems
        .sortBy('metrics.total_line_item_level_impressions.value', true)
        .inGroupsOf(5)
        .map('compact')
    })
  }
}
