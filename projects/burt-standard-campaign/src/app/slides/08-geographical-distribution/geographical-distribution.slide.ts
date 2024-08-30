import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {StandardDataService, Region} from '../../services/standard-data.service'
import {TemplateConfigService} from '../../services/template-config.service'
import {combineLatest} from 'rxjs'

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
    }
  }

  topRegions: Region[]
  metrics: any

  constructor(
    dataService: StandardDataService,
    variables: Variables,
    templateConfigService: TemplateConfigService
  ) {
    combineLatest([
      dataService.regions(),
      templateConfigService.getTemplateConfigs()
    ])
    .subscribe(([regions, templateConfigs]) => {
      this.loading = false
      if (!regions || !regions.length) return
      this.mapSeries = [{
        data: regions.map(region => {
          return [region.code, Object.get(region, 'metrics.total_line_item_level_impressions.value')]
        })
      }]

      this.metrics = regions[0].metrics
      this.topRegions = regions
        .sortBy('metrics.total_line_item_level_impressions.value', true)
        .slice(0, 5)

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map.min,
        maxColor: (templateConfigs && templateConfigs.primary_color) || variables.colors.map.max,
      })
    })
  }
}
