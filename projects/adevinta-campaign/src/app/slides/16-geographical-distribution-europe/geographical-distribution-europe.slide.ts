import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {AdevintaDataService, Country} from '../../services/adevinta-data.service'
import { combineLatest } from 'rxjs'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'geographical-distribution-europe',
  templateUrl: './geographical-distribution-europe.slide.html',
  styleUrls: ['./geographical-distribution-europe.slide.less']
})
export class GeographicalDistributionEuropeSlide {
  loading = true
  mapSeries: any[]
  mapOptions = {
    chart: {
      map: 'europe',
    },
    colorAxis: {
      type: 'linear',
      stops: null
    },
  }

  topCountries: Country[]

  constructor(
    dataService: AdevintaDataService,
    variables: Variables,
    settingsService: AdevintaSettingsService,
  ) {
    combineLatest([
      dataService.countries(),
      settingsService.settingData('chartColor')
    ])
    .subscribe(([countries, chartColor]) => {
      this.loading = false;
      if (!countries || !countries.length) { return };
      const europeanCountries = countries.filter(country => this.getIsEuropeanCountry(country.code));
      this.mapSeries = [{
        data: europeanCountries.map(country => {
          return [country.code, Object.get(country, 'metrics.gam_impressions.value')];
        })
      }];

      this.topCountries = europeanCountries
        .sortBy('metrics.gam_impressions.value', true)
        .slice(0, 5);

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors[chartColor.data].secondary,
        maxColor: variables.colors[chartColor.data].primary,
      })
    });
  }

  /**
   * Return is country european or not
   * Uses some undocumented internal api that's unreliable
   * @param {string} countryCode code of the country
   * @returns {boolean} is country european or not
   */
  getIsEuropeanCountry(countryCode: string): boolean {
    const highcharts = (<any>window).Highcharts
    if (!highcharts) { return false }
    const mapData = highcharts.maps[this.mapOptions.chart.map]

    return mapData && mapData.features && mapData.features.find &&
      mapData.features.find((data) => {
        return data && data.properties && data.properties['hc-key'] &&
          data.properties['hc-key'].toUpperCase() === countryCode.toUpperCase()
      })
  }
}
