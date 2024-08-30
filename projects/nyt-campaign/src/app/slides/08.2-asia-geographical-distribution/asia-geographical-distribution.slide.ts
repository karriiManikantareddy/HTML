import {Component, Input} from '@angular/core'
import {NytDataService, Country} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../services/nyt-settings.service'
import {combineLatest} from 'rxjs'


@Component({
  selector: 'asia-geographical-distribution',
  templateUrl: './asia-geographical-distribution.slide.html',
})
export class AsiaGeographicalDistributionSlide {
  loading = true
  mapSeries: ChartSeries[] = []
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null,
    },
    chart: {
      map: "asia",
    },
    legend: {
      x: 100,
      y: 200
    }
  }

  countryList = ['iran', 'philippines', 'saudi arabia', 'japan', 'thailand', 'oman', 'yemen', 'india', 'south korea', 'bangladesh', 'spratly islands', 'china', 'bahrain', 'myanmar (burma)', 'indonesia', 'singapore', 'russia', 'scarborough reef', 'malaysia', 'azerbaijan', 'armenia', 'vietnam', 'tajikistan', 'uzbekistan', 'east timor', 'cambodia', 'bhutan', 'georgia', 'kazakhstan', 'israel', 'syria', 'jordan', 'turkmenistan', 'cyprus no mans area', 'mongolia', 'kuwait', 'iraq', 'united arab emirates', 'laos', 'pakistan', 'siachen glacier', 'qatar', 'turkey', 'brunei', 'afghanistan', 'north korea', 'lebanon', 'northern cyprus', 'cyprus', 'taiwan', 'nepal', 'sri lanka', 'kyrgyzstan']

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
      countries = countries.filter(country => this.countryList.includes(country && country.name && country.name.toLowerCase()))

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
