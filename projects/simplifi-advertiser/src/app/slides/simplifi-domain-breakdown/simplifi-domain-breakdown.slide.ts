import {Component} from '@angular/core'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'
import { forkJoin, take } from 'rxjs'

@Component({
  selector: 'simplifi-domain-breakdown',
  templateUrl: './simplifi-domain-breakdown.slide.html',
})
export class SimplifiDomainBreakdownSlide {
  loading = true
  displayDomains?: Item[]
  videoDomains?: Item[]
  audioDomains?: Item[];
  displayKpis = ['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits']
  videoKpis = ['impressions', 'online_visits', 'total_visits']
  audioKpis = ['impressions', 'online_visits', 'total_visits'];

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
  ) {
    settingsService.settingData('campaignTactic').subscribe(goal => {
      this.displayKpis = dataService.filterKPIs(['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits'], goal.data)
      this.videoKpis = dataService.filterKPIs(['impressions', 'online_visits', 'total_visits'], goal.data)
    })
    forkJoin([
      dataService.simplifiDisplayDomainBreakdownItems(),
      dataService.simplifiVideoDomainBreakdownItems(),
      dataService.simplifiAudioDomainBreakdownItems(),
    ]).pipe(take(1)).subscribe(([displayDomains, videoDomains, audioDomains]) => {
      this.loading = false
      this.displayDomains = displayDomains;
      this.videoDomains = videoDomains;
      this.audioDomains = audioDomains;
    })
  }
}
