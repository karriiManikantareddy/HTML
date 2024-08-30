import { Component } from '@angular/core';
import { Metro, TheAdvocateDataService } from '../../services/the-advocate-data.service';
import { Variables } from 'projects/template-module/src/public_api';

@Component({
  selector: 'geofencing-geo',
  templateUrl: './geofencing-geo.component.html',
})
export class GeofencingGeoComponent {
  loading: boolean = true
  geos?: Metro[]
  kpis: string[] = ['impressions', 'clicks', 'ctr']
  mapSeries: any[]
  topMetros: Metro[]
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null,
    },
    chart: {
      map: 'countries/us/us-dma-city',
    },
  }

  constructor(dataService: TheAdvocateDataService, variables: Variables) {
    dataService.geoFencingCity().subscribe(metros => {
      this.loading = false
      this.mapSeries = [{
        data: metros
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            return [metro.name, metro.metrics.impressions.value]
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }]
      this.topMetros = metros
        .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 5)

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map.min,
        maxColor: variables.colors.map.max
      })
    })
  }
}
