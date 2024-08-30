import { Component } from '@angular/core';
import { Item, TheAdvocateDataService } from '../../services/the-advocate-data.service';

@Component({
  selector: 'sem-keyword-breakdown',
  templateUrl: './sem-keyword-breakdown.component.html',
})
export class SemKeywordBreakdownComponent {
  loading = true;
  keywords: Item[];
  kpis = ['impressions', 'clicks', 'ctr', 'cpc', 'conversions'];
  list = ['Ad group', 'Campaign'];

  constructor(dataService: TheAdvocateDataService) {
    dataService.semKeywordreakdown().subscribe(keywords => {
      this.loading = false;
      this.keywords = keywords
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10);
    });
  }
}
