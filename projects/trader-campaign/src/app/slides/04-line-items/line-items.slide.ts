import {Component} from '@angular/core'
import {forkJoin} from 'rxjs'
import {TraderDataService, LineItem} from '../../services/trader-data.service'

@Component({
  selector: 'line-items',
  templateUrl: './line-items.slide.html',
  styleUrls: ['./line-items.slide.less']
})
export class LineItemsSlide {
  loading = true
  pages: Map<string, LineItem[]>[] = []
  campaignsByPage: string[][] = []

  MAX_ITEMS = 6

  constructor(dataService: TraderDataService) {
    dataService.lineItems().subscribe(lineItems => {
      this.loading = false
      const lineItemsByCampaign = lineItems
        .groupBy('campaignName')
      let items = 0
      Object.keys(lineItemsByCampaign).forEach((campaign: string) => {
        const lineItems = lineItemsByCampaign[campaign]
        const newItems = lineItems.length + 1 + items
        if (newItems > this.MAX_ITEMS) {
          const lineItemGroups = lineItems.inGroupsOf(this.MAX_ITEMS - 1).map(g => g.compact())
          lineItemGroups.forEach(group => {
            const pageMap = new Map()
            pageMap.set(campaign, group)
            this.pages.push(pageMap)
          })
          items = lineItemGroups.last().length + 1
        } else {
          const pageMap = new Map()
          pageMap.set(campaign, lineItems)
          this.pages.push(pageMap)
          items = newItems
        }
        this.campaignsByPage = this.pages.map(p => Array.from(p.keys()))
      })
    })
  }
}
