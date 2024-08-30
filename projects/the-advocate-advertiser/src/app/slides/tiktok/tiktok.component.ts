import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service';

@Component({
  selector: 'tiktok-overview',
  templateUrl: './tiktok.component.html',
})
export class TiktokComponent {
  loading: boolean = true;
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  series: any;
  chartConfig: ChartConfig;

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.tiktokDisplayTotals(),
      dataService.tiktokDisplayTotalsByDay(),
    ]).subscribe(([totals, tiktokByDay]) => {
      this.loading = false;
      this.totals = totals;
      this.series = tiktokByDay;
      this.chartConfig = { barMetric: 'impressions', splines: ['clicks']};
    });
  }
}
