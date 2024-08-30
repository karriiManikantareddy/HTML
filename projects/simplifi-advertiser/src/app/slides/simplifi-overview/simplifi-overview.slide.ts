import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { Metric } from 'projects/template-module/src/lib/services/schema.model'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, ChartConfig} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-overview',
  templateUrl: './simplifi-overview.slide.html',
})
export class SimplifiOverviewSlide {
  loading = true
  totals: Partial<Record<string, MetricValue>>
  series: any
  chartConfig: ChartConfig
  kpis = ['impressions', 'reach', 'frequency', 'clicks', 'vcr', 'online_visits', 'total_visits']
  goal = 'cpa'

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    ) {
    combineLatest([
      dataService.simplifiTotals(),
      dataService.simplifiTotalsByDay(),
      dataService.simplifiReachTotals(),
    ]).subscribe(([totals, advertiserByDay, reachTotals]) => {
        this.loading = false
        this.totals = {...totals, ...reachTotals }
        if (this.totals.impressions && this.totals.reach) {
          const frequencyValue = this.totals.impressions.value / this.totals.reach.value
          const frequencyMetric: Metric = new Metric(this.totals.frequency.name, this.totals.frequency.meta)
          this.totals['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
        }
        this.series = advertiserByDay
        this.chartConfig = { barMetric: 'impressions', splines: ['display_native_ctr']}
      })
    settingsService.settingData('campaignTactic').subscribe(goal => {
      this.goal = goal.data
      this.kpis = dataService.filterKPIs(['impressions', 'reach', 'frequency', 'clicks', 'vcr', 'online_visits', 'total_visits'], this.goal)
    })
  }
}
