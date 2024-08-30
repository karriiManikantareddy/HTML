import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import {SimplifiDataService, ChartConfig} from '../../services/simplifi-data.service';

@Component({
  selector: 'facebook-conversions',
  templateUrl: './facebook-conversions.component.html',
})
export class FacebookConversionsComponent {
  loading = true;
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  series: any;
  chartConfig: ChartConfig;
  kpis = ['impressions', 'link_clicks', 'link_click_ctr', 'conversions', 'conversion_rate'];

  constructor(
    dataService: SimplifiDataService,
    ) {
    forkJoin([dataService.facebookTotals(), dataService.facebookConversionByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false;
        this.totals = totals;
        this.series = advertiserByDay;
        this.chartConfig = { barMetric: 'conversions', splines: ['conversion_rate']};
      })
  }
}
