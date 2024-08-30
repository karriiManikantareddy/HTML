import {Component} from '@angular/core'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'facebook-campaign-breakdown',
  templateUrl: './facebook-campaign-breakdown.slide.html',
})
export class FacebookCampaignBreakdownSlide {
  loading = true
  facebookCampaigns?: Item[];
  instagramCampaigns?: Item[];
  kpis = ['impressions', 'link_clicks', 'link_click_ctr', 'reach', 'frequency']

  constructor(dataService: SimplifiDataService) {
    dataService.facebookCampaignBreakdownItems().subscribe(campaigns => {
      this.loading = false
      this.facebookCampaigns = campaigns
        .filter(f => f.product === 'Facebook')
        .sortBy(c => -c.metrics.link_clicks.value)
        .slice(0, 4);
      this.instagramCampaigns = campaigns
        .filter(f => f.product === 'Instagram')
        .sortBy(c => -c.metrics.link_clicks.value)
        .slice(0, 4);
    })
  }
}
