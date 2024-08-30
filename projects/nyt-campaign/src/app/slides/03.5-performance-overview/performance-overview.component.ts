import { Component, OnDestroy, Input } from '@angular/core';
import { combineLatest, Subscription  } from 'rxjs';
import { NytDataService, LineItem, DfpCreative } from '../../services/nyt-data.service';
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';
import { NytSettingsService } from '../../services/nyt-settings.service';


@Component({
  selector: 'performance-overview',
  templateUrl: './performance-overview.component.html',
  styleUrls: ['./performance-overview.component.less']
})
export class PerformanceOverviewComponent implements OnDestroy {
  loading = true;
  totals: Partial<Readonly<Record<string, number>>> = {};
  chartSeries: ChartSeries[] = [];
  useThirdParty = false;
  metricType: 'first' | 'third' | 'both' = 'both';
  cpmLineItems: Partial<Readonly<Record<string, number>>> = {};
  cpdLineItems: Partial<Readonly<Record<string, number>>> = {};
  topLineItemsSort: 'dfp_total_line_item_level_impressions' | 'dfp_total_line_item_level_clicks' | 'dfp_total_active_view_viewable_impressions' | 'dfp_ctr' | 'dfp_vcr' = 'dfp_ctr';
  topLineItems: any;
  topCreatives: DfpCreative[];
  creativeGroups: DfpCreative[][] = [[]];
  subscription: Subscription;
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(
    settingsState: NytSettingsService,
    dataService: NytDataService,
    settingsService: NytSettingsService,
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('metricTypes'),
      settingsState.settingData('topLineItemsSortTypes'),
      dataService.totals(),
      dataService.series(),
      dataService.lineItems(),
      dataService.creatives(),
    ])
      .subscribe(([metricTypeSetting, topLineItemsSortSetting, totals, series, lineItems, allCreatives]) => {
        if (metricTypeSetting === null) {
          console.warn('metricTypeSetting is null/undefined');
        } else if (metricTypeSetting.data) {
          this.metricType = metricTypeSetting.data;
        }
        if (topLineItemsSortSetting === null) {
          console.warn('topLineItemsSortSetting is null/undefined');
        } else if (topLineItemsSortSetting.data) {
          this.topLineItemsSort = topLineItemsSortSetting.data;
        }
        this.loading = false;
        this.totals = totals;

        this.topLineItems = lineItems
          .filter(li => li.metrics.dfp_total_line_item_level_impressions && li.revenueType !== 'Added Value')
          .sortBy(li => {
            return li.metrics[this.topLineItemsSort]
          }, true)
          .slice(0, 1);

        const creatives = allCreatives
          .filter(c => (c.costType === 'CPM' || c.costType === 'CPD'))
          .filter(c => c.metrics.dfp_total_line_item_level_all_revenue !== 0)
          .filter(c => c.name != null);

        const uniqueCreatives: Partial<Record<string, DfpCreative>> = {};
        for (const c of creatives) {
          const key = `${c.name.replace(/\s\(copy\)+/g, '')} ${c.lineItemName}`;
          const previousCreative = uniqueCreatives[key];
          const previousMetrics = previousCreative && previousCreative.metrics || {};
          uniqueCreatives[key] = {
            name: c.name.replace(/\s\(copy\)+/g, ''),
            id: key.replace(/\//g, ''),
            previewUrl: c.previewUrl,
            height: c.height,
            width: c.width,
            lineItemName: c.lineItemName,
            metrics: {
              dfp_total_line_item_level_impressions: (c.metrics.dfp_total_line_item_level_impressions || 0) + (previousMetrics.dfp_total_line_item_level_impressions || 0),
              dfp_total_line_item_level_clicks: (c.metrics.dfp_total_line_item_level_clicks || 0) + (previousMetrics.dfp_total_line_item_level_clicks || 0),
              dfp_ctr: ((c.metrics.dfp_total_line_item_level_clicks || 0) + (previousMetrics.dfp_total_line_item_level_clicks || 0)) / ((c.metrics.dfp_total_line_item_level_impressions || 0) + (previousMetrics.dfp_total_line_item_level_impressions || 0)),
              dfp_total_active_view_viewable_impressions: (c.metrics.dfp_total_active_view_viewable_impressions || 0) + (previousMetrics.dfp_total_active_view_viewable_impressions || 0),
              dfp_total_active_view_measurable_impressions: (c.metrics.dfp_total_active_view_measurable_impressions || 0) + (previousMetrics.dfp_total_active_view_measurable_impressions || 0),
              dfp_total_active_view_viewable_impressions_rate: ((c.metrics.dfp_total_active_view_viewable_impressions || 0) + (previousMetrics.dfp_total_active_view_viewable_impressions || 0)) / ((c.metrics.dfp_total_active_view_measurable_impressions || 0) + (previousMetrics.dfp_total_active_view_measurable_impressions || 0)),
            }
          };
        }

        const topCreatives = Object.values<DfpCreative>(uniqueCreatives)
          .sortBy(creative => {
            return creative.metrics.dfp_ctr || 0
          }, true)
          .slice(0, 1);

        this.topCreatives = topCreatives;

      })
  }

  addLineItemData(costType: string, metric: string, lineItems: LineItem[]): number {
    return lineItems.filter(lineItem => lineItem.costType === costType).reduce((sum, curr) => {
      return metric === 'bookedImpressions' ? sum + Number(curr[metric]) : sum + Number(curr.metrics[metric]);
    }, 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
