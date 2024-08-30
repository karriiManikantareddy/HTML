import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'madhive-publisher-breakdown',
  templateUrl: './madhive-publisher-breakdown.slide.html',
})
export class MadhivePublisherBreakdownSlide {
  loading = true
  publishers?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions_total', 'vcr']

  constructor(dataService: EwScrippsDataService) {
    dataService.madhivePublisherBreakdownItems().subscribe((publishers) => {
      this.loading = false
      this.publishers = publishers
        .sortBy(c => -c.metrics.impressions_total.value)
        .slice(0, 10)
    })
  }
}
