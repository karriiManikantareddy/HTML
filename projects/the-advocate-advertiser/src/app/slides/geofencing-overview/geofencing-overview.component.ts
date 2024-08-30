import { Component } from '@angular/core';
import { ChartConfig, TheAdvocateDataService } from '../../services/the-advocate-data.service';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { combineLatest } from 'rxjs';
import { size } from 'lodash';

@Component({
  selector: 'geofencing-overview',
  templateUrl: './geofencing-overview.component.html',
})
export class GeofencingOverviewComponent {
  loading: boolean = true
  totals: Partial<Readonly<Record<string, MetricValue>>>
  hasTotals: boolean = false;
  series: any
  chartConfig: ChartConfig

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.geoFencingOverview(),
      dataService.geoFencingByDay(),
    ]).subscribe(([totals, geofencingByday]) => {
      this.loading = false;
      this.totals = totals;
      this.hasTotals = size(totals) > 0;
      this.series = geofencingByday;  
      this.chartConfig = { barMetric: 'impressions', splines: ['clicks']};
    });
  }
}
