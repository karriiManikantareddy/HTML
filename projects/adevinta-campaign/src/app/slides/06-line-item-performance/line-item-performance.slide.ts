import { Component, OnDestroy } from '@angular/core'
import { combineLatest, Subscription } from 'rxjs'
import { AdevintaDataService, LineItem } from '../../services/adevinta-data.service'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'line-item-performance',
  templateUrl: './line-item-performance.slide.html',
  styleUrls: ['./line-item-performance.slide.less']
})
export class LineItemPerformanceSlide implements OnDestroy{
  loading = true
  lineItemsGroups: LineItem[][]
  lineItemSort: string
  subscription: Subscription;

  constructor(
    dataService: AdevintaDataService,
    settingsState: AdevintaSettingsService,
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('sortTypes'),
      dataService.lineItems()
    ]).subscribe(([lineItemSortSetting, lineItems]) => {
        this.loading = false
        if (lineItemSortSetting == null) {
          console.warn('lineItemSortingSetting is null/undefined')
        } else if (lineItemSortSetting.data) {
          this.lineItemSort = lineItemSortSetting.data
        }
        if (!lineItems || !lineItems.length) { return }
        this.lineItemsGroups = lineItems
          .sortBy(li => li.metrics[this.lineItemSort].value, true)
          .first(10)
          .inGroupsOf(5)
          .map('compact')
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
