import {Component, Input} from '@angular/core'
import {NytDataService, Country} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {combineLatest} from 'rxjs'
import {NytSettingsService} from '../../services/nyt-settings.service'


@Component({
  selector: 'world-geographical-distribution',
  templateUrl: './world-geographical-distribution.slide.html',
})
export class WorldGeographicalDistributionSlide {
  loading = true
  mapSeries: ChartSeries[] = []
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null,
    },
    chart: {
      map: "world-robinson",
    },
    legend: {
      x: 100,
      y: 200
    }
  }

  topCountries: Country[] = []
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(
    dataService: NytDataService,
    variables: Variables,
    settingsService: NytSettingsService
  ) {
    combineLatest([dataService.countries(), settingsService.settingData('colorTheme')]).subscribe(([countries, theme]) => {
      this.loading = false
      const colors = variables.colors.themes[theme.data]
      this.mapSeries = [{
        data: countries.map(country => {
          return {"key": country.name, value: country.metrics['dfp_total_line_item_level_impressions']}
        }),
        joinBy: ['name', 'key'],
      }]

      this.topCountries = countries
        .sortBy(c => c.metrics.dfp_total_line_item_level_impressions, true)
        .slice(0, 5)

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors.map.min,
        maxColor: colors.primary,
      })
    })
  }
}
