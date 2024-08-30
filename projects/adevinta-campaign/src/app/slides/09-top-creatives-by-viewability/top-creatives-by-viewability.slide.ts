import {Component} from '@angular/core'
import {AdevintaDataService, Creative} from '../../services/adevinta-data.service'
import { combineLatest } from 'rxjs'
import { Variables } from 'projects/template-module/src/public_api'
import { AdevintaSettingsService } from '../../services/adevinta-settings.service'

@Component({
  selector: 'top-creatives-by-viewability',
  templateUrl: './top-creatives-by-viewability.slide.html',
  styleUrls: ['./top-creatives-by-viewability.slide.less']
})
export class TopCreativesByViewabilitySlide {
  loading = true
  topCreatives: Creative[]
  totalMetrics = {}
  primaryColor: string;
  secondaryColor: string;

  constructor(
    dataService: AdevintaDataService,
    variables: Variables,
    settingsService: AdevintaSettingsService,
  ) {
    combineLatest([
      dataService.creatives(),
      settingsService.settingData('chartColor'),
    ]).subscribe(([creatives, chartColor]) => {
      this.loading = false
      this.primaryColor = variables.colors[chartColor.data].primary;
      this.secondaryColor = variables.colors[chartColor.data].secondary;

      if (!creatives || !creatives.length) { return }
      this.totalMetrics['gam_impressions'] = creatives.map('metrics.gam_impressions.value').sum()
      this.totalMetrics['gam_clicks'] = creatives.map('metrics.gam_clicks.value').sum()
      this.topCreatives = creatives
        .sortBy('metrics.gam_viewability.value', true)
        .filter(creative => !creative.width || creative.width > 1)
        .slice(0, 2)
        .compact()
    });
  }
}
