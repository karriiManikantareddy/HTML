import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {EwScrippsDataService, Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'callrail-breakdown',
  templateUrl: './callrail-breakdown.slide.html',
})
export class CallrailBreakdownSlide {
  loading = true
  calls?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['total_calls', 'answer_rate', 'average_duration']

  constructor(dataService: EwScrippsDataService) {
    combineLatest([
      dataService.callrailTotals(),
      dataService.callrailBreakdownItems(),
    ]).subscribe(([totals, calls]) => {
      this.loading = false
      this.totals = totals
      this.calls = calls
        .slice(0, 5)
    })
  }
}
