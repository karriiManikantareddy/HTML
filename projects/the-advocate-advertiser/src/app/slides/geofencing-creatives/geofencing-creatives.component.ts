import { Component } from '@angular/core';
import { Item, TheAdvocateDataService } from '../../services/the-advocate-data.service';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'geofencing-creatives',
  templateUrl: './geofencing-creatives.component.html',
})
export class GeofencingCreativesComponent {
  loading: boolean = true
  creativeGroups?: Item[][]
  totals: Partial<Readonly<Record<string, MetricValue>>>
  kpis: string[] = ['impressions', 'clicks', 'ctr', 'conversions', '01_click_conversion', '01_view_through_conversion']

  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.geoFencingOverview(),
      dataService.geoFencingCreatives(),
    ]).subscribe(([totals, creatives]) => {
        this.loading = false
        this.totals = totals
        this.creativeGroups = creatives
          .sortBy(c => -c.metrics.impressions.value)
          .inGroupsOf(10)
          .map('compact')
      })
  }
}
