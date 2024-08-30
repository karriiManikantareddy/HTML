import { Component, OnDestroy } from '@angular/core'
import { combineLatest, Subscription } from 'rxjs'
import { AdevintaDataService, Position } from '../../services/adevinta-data.service'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'position-performance',
  templateUrl: './position-performance.slide.html',
  styleUrls: ['./position-performance.slide.less']
})
export class PositionPerformanceSlide implements OnDestroy{
  loading = true
  positionGroups: Position[][]
  sortSetting: string;
  subscription: Subscription;

  constructor(
    dataService: AdevintaDataService,
    settingsState: AdevintaSettingsService
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('sortTypes'),
      dataService.positions()
    ])
      .subscribe(([sortSetting, positions]) => {
        this.loading = false
        if (!positions || !positions.length) { return }
        if (sortSetting == null) {
          console.warn('lineItemSortingSetting is null/undefined')
        } else if (sortSetting.data) {
          this.sortSetting = sortSetting.data
        }
        this.positionGroups = positions
          .filter((position) => {
            const metrics = position.metrics || {}
            return metrics.impressions && metrics.impressions.value > 1000 &&
              metrics.viewability && metrics.viewability.value > 0.5
          })
          .sortBy('metrics.impressions.value', true)
          .first(10)
          .inGroupsOf(5)
          .map('compact')
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
