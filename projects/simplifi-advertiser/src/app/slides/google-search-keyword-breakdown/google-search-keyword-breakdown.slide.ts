import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'google-search-keyword-breakdown',
  templateUrl: './google-search-keyword-breakdown.slide.html',
  styleUrls: ['./google-search-keyword-breakdown.slide.less']
})
export class GoogleSearchKeywordBreakdownSlide {
  loading = true
  keywords?: Item[]
  kpis = ['impressions', 'clicks', 'ctr', 'conversions']
  legendItems: any[] = []
  primaryColor: string = '#E05534'
  theme: string = 'dark'

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
    ) {
    combineLatest(
      dataService.googleSearchKeywords(),
      dataService.googleSearchDevices(),
    ).subscribe(([keywords, devices]) => {
      this.loading = false
      this.keywords = keywords
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
    })
    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
    })
    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
    })
  }
}
