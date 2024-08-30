import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {NytDataService, LineItem} from '../../services/nyt-data.service'
import {NytSettingsService} from '../../services/nyt-settings.service'
import {MetricChangeEvent} from './line-item-top/line-item-top.component'

@Component({
  selector: 'top-line-item',
  templateUrl: './top-line-item.slide.html',
  styleUrls: ['./top-line-item.slide.less']
})
export class TopLineItemSlide {
  loading = true
  lineItems: LineItem[] = []
  totalMetrics: Record<string, number> = {}
  useThirdParty: boolean = false
  topLineItemsSort: 'dfp_total_line_item_level_impressions' | 'dfp_total_line_item_level_clicks' | 'dfp_total_active_view_viewable_impressions' | 'dfp_ctr' | 'dfp_vcr' = 'dfp_total_line_item_level_impressions'

  private totalMetricsExcludingTop: Record<string, number> = {}

  constructor(
    settingsState: NytSettingsService,
    dataService: NytDataService
  ) {
    combineLatest([
      settingsState.settingData('metricTypes'),
      settingsState.settingData('topLineItemsSortTypes'),
      dataService.lineItems()
    ])
    .subscribe(([metricTypeSetting, topLineItemsSortSetting, lineItems]) => {
      if (metricTypeSetting == null) {
        console.warn('metricTypeSetting is null/undefined')
      } else if (metricTypeSetting.data) {
        this.useThirdParty = metricTypeSetting.data === 'third'
      }

      if (topLineItemsSortSetting == null) {
        console.warn('topLineItemsSortSetting is null/undefined')
      } else if (topLineItemsSortSetting.data) {
        this.topLineItemsSort = topLineItemsSortSetting.data
      }

      this.loading = false

      const topLineItems = lineItems
        .filter(li => li.metrics.dfp_total_line_item_level_impressions && li.revenueType !== 'Added Value')
        .sortBy(li => {
          if (this.topLineItemsSort === 'dfp_total_line_item_level_impressions') {
            return (li.metrics.dfp_total_line_item_level_impressions || 0) + (li.metrics.dfp_total_line_item_level_impressions || 0)
          } else if (this.topLineItemsSort === 'dfp_total_line_item_level_clicks') {
            return (li.metrics.dr_third_party_clicks || 0) + (li.metrics.dfp_total_line_item_level_clicks || 0)
          } else {
            return li.metrics[this.topLineItemsSort]
          }
        }, true)
        .slice(0, 2)
      const lineItemsExcludingTop = lineItems.filter(lineItem => !topLineItems.find(topLineItem => topLineItem.name === lineItem.name))

      const totalMetricsExcludingTop = {}
      if (this.useThirdParty) {
        totalMetricsExcludingTop['dr_third_party_impressions'] = lineItemsExcludingTop.sum(li => li.metrics.dr_third_party_impressions || 0)
        totalMetricsExcludingTop['dr_third_party_clicks'] = lineItemsExcludingTop.sum(li => li.metrics.dr_third_party_clicks || 0)
      } else {
        totalMetricsExcludingTop['dfp_total_line_item_level_impressions'] = lineItemsExcludingTop.sum(li => li.metrics.dfp_total_line_item_level_impressions || 0)
        totalMetricsExcludingTop['dfp_total_line_item_level_clicks'] = lineItemsExcludingTop.sum(li => li.metrics.dfp_total_line_item_level_clicks || 0)
      }

      this.totalMetrics = this.calculateTotals(totalMetricsExcludingTop, topLineItems)
      this.lineItems = topLineItems
      this.totalMetricsExcludingTop = totalMetricsExcludingTop

    })
  }

  lineItemChanged(data: MetricChangeEvent) {
    const changedLineItem = this.lineItems.find(lineItem => lineItem.name === data.lineItemName)
    changedLineItem.metrics[data.metric] = data.value
    this.totalMetrics = this.calculateTotals(this.totalMetricsExcludingTop, this.lineItems)
  }

  calculateTotals(totalMetricsExcludingTop: Record<string, number>, topLineItems: LineItem[]) {
    const totalMetrics = Object.clone(totalMetricsExcludingTop, true) as Record<string, number>
    if (this.useThirdParty) {
      totalMetrics['dr_third_party_impressions'] += topLineItems.sum(li => li.metrics.dr_third_party_impressions || 0)
      totalMetrics['dr_third_party_clicks'] += topLineItems.sum(li => li.metrics.dr_third_party_clicks || 0)
    } else {
      totalMetrics['dfp_total_line_item_level_impressions'] += topLineItems.sum(li => li.metrics.dfp_total_line_item_level_impressions || 0)
      totalMetrics['dfp_total_line_item_level_clicks'] += topLineItems.sum(li => li.metrics.dfp_total_line_item_level_clicks || 0)
    }
    return totalMetrics
  }

  static DEFAULT_OPTIONS = {
    HEIGHT: 250,
    IMPRESSION_COLOR: '#48ABDF',
    CLICKS_COLOR: '#9F2BDD',
    SECONDARY_COLOR: 'rgb(234, 240, 244)',
    INNER_SIZE: '90%'
  }
}
