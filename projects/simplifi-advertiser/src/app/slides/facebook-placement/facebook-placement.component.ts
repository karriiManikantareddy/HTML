import {Component} from '@angular/core';
import {SimplifiDataService, Item} from '../../services/simplifi-data.service';

@Component({
  selector: 'facebook-placement',
  templateUrl: './facebook-placement.component.html',
})
export class FacebookPlacementComponent {
  loading = true;
  facebookCampaigns?: Item[];
  facebookAdSet?: Item[];
  kpis = ['impressions', 'link_clicks', 'link_click_ctr'];

  constructor(dataService: SimplifiDataService) {
    dataService.facebookPlacementsBreakdowns().subscribe(placements => {
      this.loading = false;
      this.facebookCampaigns = placements
        .sortBy(c => -c.metrics.link_clicks.value)
        .slice(0, 4);
    })
  }
}
