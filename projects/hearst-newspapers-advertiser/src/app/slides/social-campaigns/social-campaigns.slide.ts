import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, SocialCampaign} from '../../services/hearst-newspapers-data.service'

@Component({
  selector: 'social-campaigns',
  templateUrl: './social-campaigns.slide.html',
  styleUrls: ['./social-campaigns.slide.less']
})
export class SocialCampaignsSlide {
  loading = true
  hasSocial: boolean
  campaigns?: SocialCampaign[]

  constructor(dataService: HearstNewspapersDataService) {
    combineLatest([
      dataService.socialCampaigns(),
      dataService.hasSocial(),
    ]).subscribe(([campaigns, hasSocial]) => {
      this.hasSocial = hasSocial
      this.loading = false
      this.campaigns = campaigns
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 7)
    })
  }
}
