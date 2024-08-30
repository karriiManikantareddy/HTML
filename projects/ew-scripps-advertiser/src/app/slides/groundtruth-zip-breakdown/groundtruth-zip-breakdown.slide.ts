import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'groundtruth-zip-breakdown',
  templateUrl: './groundtruth-zip-breakdown.slide.html',
})
export class GroundtruthZipBreakdownSlide {
  loading = true
  zips?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'clicks', 'ctr', 'visits']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.groundtruthTotals(),
      dataService.groundtruthZipBreakdownItems(),
    ]).subscribe(([totals, zips]) => {
      this.loading = false
      this.totals = totals
      this.zips = zips
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 10)
    })
  }
}
