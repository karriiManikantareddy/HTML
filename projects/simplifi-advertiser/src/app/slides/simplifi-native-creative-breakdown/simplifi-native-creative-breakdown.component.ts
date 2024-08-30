import { Component } from '@angular/core';
import { Item, SimplifiDataService } from '../../services/simplifi-data.service';

@Component({
  selector: 'simplifi-native-creative-breakdown',
  templateUrl: './simplifi-native-creative-breakdown.component.html',
})
export class SimplifiNativeCreativeBreakdownComponent {
  loading = true;
  campaigns?: Item[];
  kpis = ['impressions', 'clicks', 'ctr', 'total_conversions', 'conversion_rate'];

  constructor(dataService: SimplifiDataService) {
    dataService.simplifiNativeCreativeBreakdown().subscribe(campaigns => {
      this.loading = false;
      this.campaigns = campaigns
        .filter(c => c.name !== null)
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10);
    })
  }
}
