import { Component } from '@angular/core'
import {combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'onsite-display-breakdown',
  templateUrl: './onsite-display-breakdown.slide.html',
})
export class OnsiteDisplayBreakdownSlide {
  loading: boolean = true
  creativeGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'conversions']
  breakdown: boolean = true;
  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.onsiteDisplayTotals(),
      dataService.onsiteDisplayBreakdownItems(),
      dataService.onsiteDisplayCleanName()
    ]).subscribe(([totals, creatives, cleanNames]) => {
        this.loading = false
        this.totals = totals
        this.creativeGroups = creatives
          .map(creative => {
            const matchingCleanName = cleanNames.find(cleanName => {
              return cleanName.product === creative.name &&
              cleanName.metrics.ctr.value === creative.metrics.ctr.value &&
              cleanName.metrics.total_line_item_level_impressions.value === creative.metrics.impressions.value &&
              cleanName.metrics.total_line_item_level_clicks.value === creative.metrics.clicks.value &&
              cleanName.metrics.total_conversions.value === creative.metrics.conversions.value &&
              cleanName.parent === creative.parent
            });
            return new Item(
              matchingCleanName.name,
              creative.metrics,
              creative.data, 'gam', creative.parent
            );
          })
          .sortBy(c => -c.metrics.impressions.value)
          .inGroupsOf(10)
          .map('compact')
      })
  }
}
