import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, SemCampaign} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'sem-campaigns',
  templateUrl: './sem-campaigns.slide.html',
  styleUrls: ['./sem-campaigns.slide.less']
})
export class SemCampaignsSlide {
  loading = true
  campaigns?: SemCampaign[]
  hasSem: boolean

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.semCampaigns(),
      dataService.hasSem(),
    ]).subscribe(([campaigns, hasSem]) => {
      this.loading = false
      this.hasSem = hasSem
      this.campaigns = campaigns
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 7)
    })
  }
}
