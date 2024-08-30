import { Component, OnDestroy } from '@angular/core'
import { combineLatest, Subscription } from 'rxjs'
import { AdevintaDataService, CreativeSize } from '../../services/adevinta-data.service'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'creative-size-performance',
  templateUrl: './creative-size-performance.slide.html',
  styleUrls: ['./creative-size-performance.slide.less']
})
export class CreativeSizePerformanceSlide implements OnDestroy{
  loading = true
  creativeSizesGroups: CreativeSize[][]
  sortSetting: string
  subscription: Subscription;

  constructor(
    dataService: AdevintaDataService,
    settingsState: AdevintaSettingsService
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('sortTypes'),
      dataService.creativeSizes()
    ]).subscribe(([sortSetting, creativeSizes]) => {
        this.loading = false
        if (!creativeSizes || !creativeSizes.length) { return }
        if (sortSetting == null) {
          console.warn('lineItemSortingSetting is null/undefined')
        } else if (sortSetting.data) {
          this.sortSetting = sortSetting.data
        }
        this.creativeSizesGroups = creativeSizes
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
