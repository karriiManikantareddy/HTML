import { Component } from '@angular/core';
import {SimplifiDataService, Item} from '../../services/simplifi-data.service';

@Component({
  selector: 'simplifi-native-campaign-breakdown',
  templateUrl: './simplifi-native-campaign-breakdown.component.html',
})
export class SimplifiNativeCampaignBreakdownComponent {
  loading = true;
  campaigns?: Item[];
  kpis = ['impressions', 'clicks', 'ctr', 'total_conversions', 'conversion_rate'];

  constructor(dataService: SimplifiDataService) {
    dataService.simplifiNativeCampaignBreakdown().subscribe(campaigns => {
      this.loading = false;
      this.campaigns = campaigns
        .filter(c => c.name !== null)
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10);
    })
  }
}
