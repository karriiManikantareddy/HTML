import {Component} from '@angular/core'
import {CumulusMediaDataService, SocialCampaign} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'social-campaigns',
  templateUrl: './social-campaigns.slide.html',
  styleUrls: ['./social-campaigns.slide.less']
})
export class SocialCampaignsSlide {
  loading = true
  campaigns?: SocialCampaign[]
  empty: boolean = false

  constructor(dataService: CumulusMediaDataService) {
    dataService
      .socialCampaigns()
      .subscribe(campaigns => {
        this.empty = !campaigns.length
        this.loading = false
        this.campaigns = campaigns
          .sortBy(c => -c.metrics.impressions.value)
          .slice(0, 7)
      })
  }
}
