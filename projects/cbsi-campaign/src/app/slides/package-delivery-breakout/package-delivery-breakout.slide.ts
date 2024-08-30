import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { CbsiDataService } from '../../services/cbsi-data.service'
import { CbsiSettingsService } from '../../services/cbsi-settings.service'

@Component({
  selector: 'package-delivery-breakout',
  templateUrl: './package-delivery-breakout.slide.html',
  styleUrls: ['./package-delivery-breakout.slide.less']
})
export class PackageDeliveryBreakoutSlide {
  loading = true
  packagesGroups: any[] = []
  impressionType: string

  constructor(
    dataService: CbsiDataService,
    settingsState: CbsiSettingsService
  ) {
    combineLatest([
      dataService.packages(),
      settingsState.settingData('impressionType')
    ]).subscribe(([packages, impressionType]) => {
      this.impressionType = impressionType.data;
      this.packagesGroups = packages && packages
        .sortBy('metrics.' + this.impressionType, true)
        .inGroupsOf(3)
        .map('compact')
      this.loading = false
    })
  }
}
