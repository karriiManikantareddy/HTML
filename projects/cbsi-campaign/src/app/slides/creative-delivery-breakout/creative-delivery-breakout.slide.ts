import { Component } from '@angular/core'
import { SettingData } from 'projects/settings-module/src/lib/setting.model'
import { combineLatest, Observable } from 'rxjs'
import { CbsiDataService } from '../../services/cbsi-data.service'
import { CbsiSettingsService } from '../../services/cbsi-settings.service'

@Component({
  selector: 'creative-delivery-breakout',
  templateUrl: './creative-delivery-breakout.slide.html',
  styleUrls: ['./creative-delivery-breakout.slide.less']
})
export class CreativeDeliveryBreakoutSlide {
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
    });
  }
}
