import {Component, Input} from '@angular/core'
import {NytDataService, Region} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {combineLatest} from 'rxjs'
import {NytSettingsService} from '../../services/nyt-settings.service'


@Component({
  selector: 'geographical-distribution',
  templateUrl: './geographical-distribution.slide.html',
})
export class GeographicalDistributionSlide {
  loading = true
  mapSeries: ChartSeries[] = []
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null
    },
    chart: {
      map: 'countries/us/us-all'
    },
    legend: {
      x: 130,
      y: 320
    }
  }

  topRegions: Region[] = []
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(
    dataService: NytDataService,
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
    combineLatest([dataService.regions_by_country(), settingsService.settingData('colorTheme')]).subscribe(([regionsByCountry, theme]) => {
      this.loading = false
      const usRegions = regionsByCountry['United States']
      const colors = variables.colors.themes[theme.data]
      this.mapSeries = [{
        data: usRegions.map(region => {
          return [region.code, region.metrics.dfp_total_line_item_level_impressions || 0]
        })
      }]

      this.topRegions = usRegions
        .sortBy(r => r.metrics.dfp_total_line_item_level_impressions, true)
        .slice(0, 5)

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map.min,
        maxColor: colors.primary,
      })
    })
  }
}
