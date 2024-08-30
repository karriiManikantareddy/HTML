import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-tactic-breakdown',
  templateUrl: './simplifi-tactic-breakdown.slide.html',
})
export class SimplifiTacticBreakdownSlide {
  loading = true
  tacticts?: Item[]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'online_visits', 'total_visits']

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
  ) {
    settingsService.settingData('campaignTactic').subscribe(goal => this.kpis = dataService.filterKPIs(['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'online_visits', 'total_visits'], goal.data))
    combineLatest([
      dataService.simplifiTotals(),
      dataService.simplifiTacticBreakdownItems(),
    ]).subscribe(([totals, tacticts]) => {
      this.loading = false
      this.totals = totals
      this.tacticts = tacticts
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
    })
  }
}
