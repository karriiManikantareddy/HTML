import { Component } from '@angular/core';
import { Variables } from 'projects/template-module/src/lib/variables';
import { TheAdvocateDataService, Metro } from '../../services/the-advocate-data.service';

@Component({
  selector: 'google-ads',
  templateUrl: './google-ads.component.html',
})
export class GoogleAdsComponent {
  loading: boolean = true;
  geos?: Metro[];
  kpis: string[] = ['impressions', 'clicks', 'ctr'];
  mapSeries: any[];
  topMetros: Metro[];
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null,
    },
    chart: {
      map: 'countries/us/us-dma-city',
    },
  };

  constructor(dataService: TheAdvocateDataService, variables: Variables) {
    dataService.googleAdsCitiesBreakdownItems().subscribe(metros => {

      this.loading = false;

      this.mapSeries = [{
        data: metros
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            return [metro.name, metro.metrics.impressions.value];
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }];
      this.topMetros = metros
        .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 5);
      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map.min,
        maxColor: variables.colors.map.max
      });
    });
  }
}
