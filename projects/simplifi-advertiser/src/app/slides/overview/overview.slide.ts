import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { Metric } from 'projects/template-module/src/lib/services/schema.model'
import {SimplifiDataService, Metadata, ChartConfig} from '../../services/simplifi-data.service'
import { size } from 'lodash'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading = true
  metadata?: Metadata
  totals: Partial<Record<string, MetricValue>>
  hasTotals: boolean = false;
  goal: string = 'cpa'
  formatOptions: any = {
    separatorName: 'comma',
  }


  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    ) {
    combineLatest([
      dataService.metadata(),
      dataService.simplifiTotals(),
    ]).subscribe(([metadata, totals]) => {
      this.loading = false
      this.metadata = metadata
      this.totals = totals
      if (this.totals.impressions && this.totals.reach) {
        const frequencyValue = this.totals.impressions.value / this.totals.reach.value
        const frequencyMetric: Metric = new Metric(this.totals.frequency.name, this.totals.frequency.meta)
        this.totals['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
      }
      this.hasTotals = size(totals) > 0;
    })
    settingsService.settingData('campaignTactic').subscribe(goal => {
      this.goal = goal.data
    })
  }

  setFormatting(format: string): any {
    return Object.merge(this.formatOptions, { format: format })
  }
}
