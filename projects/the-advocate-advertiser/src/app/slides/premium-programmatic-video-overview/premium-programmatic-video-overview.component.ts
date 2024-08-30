import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, ChartConfig } from '../../services/the-advocate-data.service';

@Component({
  selector: 'premium-programmatic-video-overview',
  templateUrl: './premium-programmatic-video-overview.component.html',
})
export class PremiumProgrammaticVideoOverviewComponent {
  loading: boolean = true;
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  series: any;
  chartConfig: ChartConfig;

  constructor(
    dataService: TheAdvocateDataService,
    ) {
    combineLatest([
      dataService.programmaticVideoTotals(),
      dataService.programmaticVideoTotalsByDay(),
    ]).subscribe(([totals, advertiserByDay]) => {
      this.loading = false;
      this.totals = totals;
      this.series = advertiserByDay;
      this.chartConfig = { barMetric: 'impressions', splines: ['clicks']};
    })
  }

}
