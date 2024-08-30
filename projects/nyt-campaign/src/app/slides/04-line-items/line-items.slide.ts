import {forkJoin, combineLatest, Subscription} from 'rxjs';
import {Component, OnDestroy, Input} from '@angular/core';
import {NytDataService, LineItem} from '../../services/nyt-data.service';
import {TemplateService} from 'projects/template-module/src/lib/services/template.service';
import { NytSettingsService } from '../../services/nyt-settings.service';


@Component({
  selector: 'line-items',
  templateUrl: './line-items.slide.html',
  styleUrls: ['./line-items.slide.less']
})
export class LineItemsSlide implements OnDestroy {
  loading = true;
  lineItemGroups: LineItem[][] = [];
  metricType: 'first' | 'third' | 'both' = 'both';
  lineItemSort: 'dfp_total_line_item_level_impressions' | 'dfp_total_active_view_viewable_impressions' | 'dfp_ctr' | 'dfp_vcr' = 'dfp_total_line_item_level_impressions';
  dateFormat = { pattern: '{MM}/{dd}/{yy}' };
  subscription: Subscription;
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(
    settingsState: NytSettingsService,
    dataService: NytDataService
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('metricTypes'),
      settingsState.settingData('sortTypes'),
      dataService.lineItems()
    ])
    .subscribe(([metricTypeSetting, lineItemSortSetting, lineItems]) => {
      if (metricTypeSetting === null) {
        console.warn('metricTypeSetting is null/undefined')
      } else if (metricTypeSetting.data) {
        this.metricType = metricTypeSetting.data
      }
      if (lineItemSortSetting === null) {
        console.warn('lineItemSortingSetting is null/undefined')
      } else if (lineItemSortSetting.data) {
        this.lineItemSort = lineItemSortSetting.data
      }
      this.loading = false
      this.lineItemGroups = lineItems
        .filter(li => li.metrics.dfp_total_line_item_level_impressions)
        .sortBy(li => li.metrics[this.lineItemSort], true)
        .inGroupsOf(7)
        .map('compact')
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
