import {Component} from '@angular/core'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-audience-breakdown',
  templateUrl: './simplifi-audience-breakdown.slide.html',
})
export class SimplifiAudienceBreakdownSlide {
  loading = true
  segments?: Item[]
  kpis: string[] = ['impressions', 'clicks', 'online_visits', 'total_visits']

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
  ) {
    settingsService.settingData('campaignTactic').subscribe(goal => this.kpis = dataService.filterKPIs(['impressions', 'clicks', 'online_visits', 'total_visits'], goal.data))
    dataService.simplifiAudienceBreakdownItems().subscribe((segments) => {
      this.loading = false
      this.segments = segments
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
    })
  }
}
