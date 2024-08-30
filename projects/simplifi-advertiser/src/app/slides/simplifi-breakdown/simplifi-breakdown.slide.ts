import {Component} from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-breakdown',
  templateUrl: './simplifi-breakdown.slide.html',
})
export class SimplifiBreakdownSlide {
  loading = true
  displayCreatives: Item[]
  videoCreatives: Item[]
  audioCreatives: Item[];
  displayKpis = ['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'online_visits', 'total_visits']
  videoKpis = ['impressions', 'reach', 'frequency', 'vcr', 'online_visits', 'total_visits']
  audioKpis = ['impressions', 'online_visits', 'total_visits'];

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
  ) {
    settingsService.settingData('campaignTactic').subscribe(goal => {
      this.displayKpis = dataService.filterKPIs(['impressions', 'reach', 'frequency', 'clicks', 'ctr', 'online_visits', 'total_visits'], goal.data)
      this.videoKpis = dataService.filterKPIs(['impressions', 'reach', 'frequency', 'vcr', 'online_visits', 'total_visits'], goal.data)
    })
    dataService.simplifiBreakdownItems().subscribe(creatives => {
      this.loading = false
      this.displayCreatives = creatives
        .filter(creative => creative.type === 'Image' || creative.type === 'Rich Media' || creative.type === 'Native' || creative.name === 'Unknown')
        .sortBy(creative => -creative.metrics.impressions.value)
        .slice(0, 5)
        this.videoCreatives = creatives
        .filter(creative => creative.type === 'Video' || creative.name === 'Unknown')
        .sortBy(creative => -creative.metrics.impressions.value)
        .slice(0, 5)
        this.audioCreatives = creatives
        .filter(creative => creative.type === 'Audio')
        .sortBy(creative => -creative.metrics.impressions.value)
        .slice(0, 5);
    })
  }
}
