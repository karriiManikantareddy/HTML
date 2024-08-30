import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {TraderDataService, Region} from '../../services/trader-data.service'

@Component({
  selector: 'geographical-distribution',
  templateUrl: './geographical-distribution.slide.html',
  styleUrls: ['./geographical-distribution.slide.less']
})
export class GeographicalDistributionSlide {
  loading = true
  mapSeries: any[]
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null
    },
    legend: {
      align: 'left',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      backgroundColor: 'rgba(0,0,0,0)',
      margin: 0,
      y: -25
    },
    chart: {
      map: 'countries/ca/ca-all',
      width: 600,
      height: 600
    },
    plotOptions: {
      map: {
        clip: true
      }
    }
  }

  topRegions: Region[]

  constructor(dataService: TraderDataService, variables: Variables) {
    dataService.regions().subscribe(regions => {
      this.loading = false
      this.mapSeries = [{
        data: regions.map(region => {
          return [region.code, region.metrics['total_line_item_level_impressions']]
        })
      }]

      this.topRegions = regions
        .sortBy('metrics.total_line_item_level_impressions', true)
        .slice(0, 12)
    })

    Object.merge(this.mapOptions.colorAxis, {
      minColor: variables.colors.map.min,
      maxColor: variables.colors.map.max,
    })
  }
}
