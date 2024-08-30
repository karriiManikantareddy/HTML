import { Component, OnDestroy } from '@angular/core'
import { combineLatest, Subscription } from 'rxjs'
import { AdevintaDataService, LineItem } from '../../services/adevinta-data.service'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'creative-performance',
  templateUrl: './creative-performance.slide.html',
  styleUrls: ['./creative-performance.slide.less']
})
export class CreativePerformanceSlide implements OnDestroy{
  loading = true
  creativesGroups: LineItem[][]
  sortSetting: string;
  subscription: Subscription;

  constructor(
    dataService: AdevintaDataService,
    settingsState: AdevintaSettingsService
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('sortTypes'),
      dataService.creatives()
    ]).subscribe(([sortSetting, creatives]) => {
        this.loading = false
        if (!creatives || !creatives.length) { return }
        if (sortSetting == null) {
          console.warn('lineItemSortingSetting is null/undefined')
        } else if (sortSetting.data) {
          this.sortSetting = sortSetting.data
        }
        this.creativesGroups = creatives
          .sortBy(li => li.metrics[this.sortSetting].value, true)
          .first(10)
          .inGroupsOf(5)
          .map('compact')
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
