import {Component} from '@angular/core'
import {FundaVariables} from '../../variables'
import {FundaDataService, Region} from '../../services/funda-data.service'
import {SettingsService} from '../../services/settings.service'
import {combineLatest} from 'rxjs'

@Component({
  selector: 'geographical-distribution',
  templateUrl: './geographical-distribution.slide.html',
  styleUrls: ['./geographical-distribution.slide.less']
})
export class GeographicalDistributionSlide {
  loading = true
  templateType: string = 'consumers'
  topRegions: Region[]
  mapSeries: any[]
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null
    },
    chart: {
      map: 'countries/nl/nl-all',
      marginRight: 120,
      style: {
        height: '700px',
        width: '550px'
      }
    },
    legend: {
      y: 20,
      x: 150
    }
  }

  constructor(dataService: FundaDataService, variables: FundaVariables, settingsService: SettingsService) {
    combineLatest<any>(
      dataService.dfpRegions(),
      settingsService.settingData('template-type'),
    )
    .subscribe(([regions, templateType]) => {
      this.loading = false
      this.templateType = templateType && templateType.data
      this.mapSeries = [{
        data: regions.map(region => {
          return [region.code, region.metrics['dfp_total_line_item_level_impressions']]
        })
      }]
      this.topRegions = regions
        .sortBy('metrics.dfp_total_line_item_level_impressions', true)
        .slice(0, 5)

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map[this.templateType].min,
        maxColor: variables.colors.map[this.templateType].max
      })
    })
  }
}
