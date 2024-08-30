import {Component, Input} from '@angular/core'
import {NytDataService, Country} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../services/nyt-settings.service'
import {combineLatest} from 'rxjs'


@Component({
  selector: 'europe-geographical-distribution',
  templateUrl: './europe-geographical-distribution.slide.html',
})
export class EuropeGeographicalDistributionSlide {
  loading = true
  mapSeries: ChartSeries[] = []
  mapOptions = {
    colorAxis: {
      type: 'linear',
      stops: null,
    },
    chart: {
      map: "europe",
    },
    legend: {
      x: 100,
      y: 200
    }
  }

  countryList = ['denmark', 'faroe islands', 'croatia', 'netherlands', 'estonia', 'bulgaria', 'spain', 'italy', 'san marino', 'vatican', 'turkey', 'malta', 'france', 'norway', 'germany', 'ireland', 'ukraine', 'finland', 'sweden', 'russia', 'united kingdom', 'cyprus', 'portugal', 'greece', 'lithuania', 'slovenia', 'bosnia and herzegovina', 'monaco', 'albania', 'cyprus no mans area', 'northern cyprus', 'republic of serbia', 'romania', 'montenegro', 'liechtenstein', 'austria', 'slovakia', 'hungary', 'andorra', 'luxembourg', 'switzerland', 'belgium', 'kosovo', 'poland', 'macedonia', 'latvia', 'belarus', 'iceland', 'moldova', 'czechia']

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
