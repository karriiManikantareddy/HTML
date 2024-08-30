import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-city-breakdown',
  templateUrl: './simplifi-city-breakdown.slide.html',
})
export class SimplifiCityBreakdownSlide {
  loading = true
  cities?: Item[]
  kpis = ['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits']

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
  ) {
    settingsService.settingData('campaignTactic').subscribe(goal => this.kpis = dataService.filterKPIs(['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits'], goal.data))
    dataService.simplifiCityBreakdownItems().subscribe((cities) => {
      this.loading = false
      this.cities = cities
    })
  }
}
