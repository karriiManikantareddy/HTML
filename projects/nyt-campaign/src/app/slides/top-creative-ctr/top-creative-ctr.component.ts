import { Component, OnDestroy, Input } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { NytDataService, DfpCreative } from '../../services/nyt-data.service';


@Component({
  selector: 'top-creative-ctr',
  templateUrl: './top-creative-ctr.component.html',
  styleUrls: ['./top-creative-ctr.component.less']
})
export class TopCreativeCtrComponent implements OnDestroy {
  topCreatives: any;
  loading = true;
  subscription: Subscription;
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(dataService: NytDataService) {
    this.subscription = combineLatest([dataService.creatives()])
      .subscribe(([allCreatives]) => {
        this.loading = false;
        const creatives = allCreatives
          .filter(c => c.metrics.dfp_total_line_item_level_all_revenue !== 0)
          .filter(c => c.name != null)
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
        this.topCreatives = Object.values<DfpCreative>(uniqueCreatives)
          .sortBy(creative => {
            return creative.metrics.dfp_ctr || 0
          }, true)
          .slice(0, 1)[0];
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
