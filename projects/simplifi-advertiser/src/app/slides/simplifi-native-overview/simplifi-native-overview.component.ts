import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import {SimplifiDataService, ChartConfig} from '../../services/simplifi-data.service';

@Component({
  selector: 'simplifi-native-overview',
  templateUrl: './simplifi-native-overview.component.html',
})
export class SimplifiNativeOverviewComponent {
  loading = true;
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  series: any;
  chartConfig: ChartConfig;
  kpis = ['impressions', 'clicks', 'ctr', 'total_conversions', 'conversion_rate'];

  constructor(
    dataService: SimplifiDataService,
    ) {
    forkJoin([dataService.simplifiNativeTotals(), dataService.simplifiNativeByDay()])
      .subscribe(([totals, advertiserByDay]) => {
        this.loading = false;
        this.totals = totals;
        this.series = advertiserByDay;
        this.chartConfig = { barMetric: 'impressions', splines: ['ctr']};
      })
  }
}
