import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'extended-network-display-breakdown',
  templateUrl: './extended-network-display-breakdown.slide.html',
})
export class ExtendedNetworkDisplayBreakdownSlide {
  loading: boolean = true
  creativeGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'postview_conversions', 'postclick_conversions']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.extendedNetworkDisplayTotals(),
      dataService.extendedNetworkDisplayBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
        this.loading = false
        this.totals = totals
        this.creativeGroups = creatives
          .sortBy(c => -c.metrics.impressions.value)
          .inGroupsOf(10)
          .map('compact')
        })
  }
}
