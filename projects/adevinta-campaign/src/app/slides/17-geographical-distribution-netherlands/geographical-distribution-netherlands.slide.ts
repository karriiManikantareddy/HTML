import { Component } from '@angular/core'
import { Variables } from 'projects/template-module/src/lib/variables'
import { AdevintaDataService, Region } from '../../services/adevinta-data.service'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'geographical-distribution-netherlands',
  templateUrl: './geographical-distribution-netherlands.slide.html',
  styleUrls: ['./geographical-distribution-netherlands.slide.less']
})
export class GeographicalDistributionNetherlandsSlide {
  loading = true
  mapSeries: any[]
  mapOptions = {
    chart: {
      map: 'countries/nl/nl-all',
    },
    colorAxis: {
      type: 'linear',
      stops: null
    },
  }

  topRegions: Region[]

  constructor(
    dataService: AdevintaDataService,
    variables: Variables,
    settingsService: AdevintaSettingsService,
  ) {
    combineLatest([
      dataService.regions(),
      settingsService.settingData('chartColor')
    ])
    .subscribe(([regions, chartColor]) => {
      this.loading = false;
      if (!regions || !regions.length) { return };
      const dutchRegions = regions.reduce((acc, region) => {
        const regionCode = this.getRegionCodeByName(region.name);
        if (regionCode) {
          region.code = regionCode;
          acc.push(region);
        }
        return acc;
      }, []);
      this.mapSeries = [{
        data: dutchRegions.map(region => {
          return [region.code, Object.get(region, 'metrics.gam_impressions.value')];
        })
      }];

      this.topRegions = dutchRegions
        .sortBy('metrics.gam_impressions.value', true)
        .slice(0, 5);

      Object.merge(this.mapOptions.colorAxis, {
        minColor: variables.colors[chartColor.data].secondary,
        maxColor: variables.colors[chartColor.data].primary,
      });
    });
  }

  /**
   * Get region code for Highcharts map by region name
   * Uses some undocumented internal api that's unreliable
   * @param {string} regionName name of the region
   * @returns {string} code of the region
   */
  getRegionCodeByName(regionName: string): string {
    const highcharts = (<any>window).Highcharts
    if (!highcharts) { return '' }
    const mapData = highcharts.maps[this.mapOptions.chart.map]

    const regionData = mapData && mapData.features && mapData.features.find &&
      mapData.features.find((data) => {
        const altNames = data.properties && data.properties['alt-name'] &&
          data.properties['alt-name'].split('|') || []
        const woeLabel = data.properties && data.properties['woe-label'] &&
          data.properties['woe-label'].split(',')[0]
        return data.properties.name === regionName ||
          woeLabel === regionName ||
          altNames.includes(regionName)
      }) || null
    return regionData && regionData.properties && regionData.properties['hc-key'] || ''
  }
}
