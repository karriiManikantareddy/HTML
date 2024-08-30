import { Component } from '@angular/core';
import {SimplifiDataService, Item} from '../../services/simplifi-data.service';

@Component({
  selector: 'simplifi-native-domain',
  templateUrl: './simpifi-native-domain.component.html',
})
export class SimplifiNativeDomainComponent {
  loading = true;
  domain?: Item[];
  kpis = ['impressions', 'clicks', 'ctr', 'total_conversions', 'conversion_rate'];

  constructor(dataService: SimplifiDataService) {
    dataService.simplifiNativeDomain().subscribe(domain => {
      this.loading = false;
      this.domain = domain
        .filter(c => c.name !== null)
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10);
    })
  }
}
