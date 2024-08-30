import { Component } from '@angular/core'
import { Variables } from 'projects/template-module/src/lib/variables'
import { TheAdvocateDataService, Metro } from '../../services/the-advocate-data.service'

@Component({
  selector: 'onsite-display-metro-breakdown',
  templateUrl: './onsite-display-metro-breakdown.slide.html',
})
export class OnsiteDisplayMetroBreakdownSlide {
  loading: boolean = true
  geos?: Metro[]
  kpis: string[] = ['total_line_item_level_impressions', 'total_line_item_level_clicks', 'ctr']
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
    dataService.onsiteDisplayMetroBreakdownItems().subscribe(metros => {
      this.loading = false
      this.mapSeries = [{
        data: metros
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            return [metro.name, metro.metrics.total_line_item_level_impressions.value]
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }]
      this.topMetros = metros
        .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
        .sortBy(c => -c.metrics.total_line_item_level_impressions.value)
        .slice(0, 10)
      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map.min,
        maxColor: variables.colors.map.max
      })
    })
  }
}
