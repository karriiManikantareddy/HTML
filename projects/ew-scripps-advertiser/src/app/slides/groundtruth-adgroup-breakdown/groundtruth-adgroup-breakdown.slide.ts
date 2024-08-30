import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'groundtruth-adgroup-breakdown',
  templateUrl: './groundtruth-adgroup-breakdown.slide.html',
})
export class GroundtruthAdgroupBreakdownSlide {
  loading = true
  adGroups?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'visits']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.groundtruthTotals(),
      dataService.groundtruthAdgroupBreakdownItems(),
    ]).subscribe(([totals, adGroups]) => {
      this.loading = false
      this.totals = totals
      this.adGroups = adGroups
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 4)
    })
  }
}
