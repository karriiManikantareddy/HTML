import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { CbsiDataService } from '../../services/cbsi-data.service'
import { CbsiSettingsService } from '../../services/cbsi-settings.service'

@Component({
  selector: 'third-party-placement-top-delivery',
  templateUrl: './third-party-placement-top-delivery.slide.html',
  styleUrls: ['./third-party-placement-top-delivery.slide.less']
})
export class ThirdPartyPlacementTopDeliverySlide {
  loading = true
  creativesGroups: any[] = []
  impressionType: string

  constructor(
    dataService: CbsiDataService,
    settingsState: CbsiSettingsService
  ) {
    combineLatest([
      dataService.creatives(),
      settingsState.settingData('impressionType')
    ]).subscribe(([creatives, impressionType]) => {
      this.impressionType = impressionType.data;
      this.creativesGroups = creatives && creatives
        .sortBy('metrics.' + this.impressionType, true)
        .slice(0, 10)
        .inGroupsOf(5)
        .map('compact')
      this.loading = false
    })
  }
}
