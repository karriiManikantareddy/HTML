import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { Metric } from 'projects/template-module/src/lib/services/schema.model'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, ChartConfig} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-mom',
  templateUrl: './simplifi-mom.slide.html',
  styleUrls: ['./simplifi-mom.slide.less'],
})
export class SimplifiMomSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  lastPeriod: Partial<Readonly<Record<string, MetricValue>>>
  kpis = ['impressions', 'reach', 'frequency', 'clicks', 'vcr', 'online_visits', 'total_visits']
  goal = 'cpa'
  formatOptions: any = {
    separatorName: 'comma',
  }

  comparionFormatting = {
    format: 'percent',
    digits: 0,
  }

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    ) {
    combineLatest([
      dataService.simplifiTotalsLastMonth(),
      dataService.simplifiTotalsLastPeriod(),
    ]).subscribe(([totals, lastPeriod]) => {
        this.loading = false
        this.totals = totals
        this.lastPeriod = lastPeriod
      })
    settingsService.settingData('campaignTactic').subscribe(goal => {
      this.goal = goal.data
      this.kpis = dataService.filterKPIs(['impressions', 'reach', 'frequency', 'clicks', 'vcr', 'online_visits', 'total_visits'], this.goal)
    })
  }

  setFormatting(format: any): any {
    return Object.merge(this.formatOptions, format)
  }
}
