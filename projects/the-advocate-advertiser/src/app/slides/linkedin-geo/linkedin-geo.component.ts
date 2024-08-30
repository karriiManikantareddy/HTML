import { Component } from '@angular/core';
import { Variables } from 'projects/template-module/src/lib/variables';
import { TheAdvocateDataService, Metro } from '../../services/the-advocate-data.service';


@Component({
  selector: 'linkedin-geo',
  templateUrl: './linkedin-geo.component.html',
})
export class LinkedInGeoComponent {
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
    dataService.linkedInCitiesBreakdownItems().subscribe(metros => {
      this.loading = false;
      this.mapSeries = [{
        data: (metros ?? [])
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            const name = metro.name
            .replace(/,/, '')           
            .replace(/area/i, '')
            .replace(/Metropolitan/i, '')
            .replace(/Greater/i, '');
            return [name.replace(/\s+/g, ' ').trim(), metro.metrics.impressions.value];
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }];
      this.topMetros = (metros ?? [])
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
