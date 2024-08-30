import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MetricValue } from 'projects/template-module/src/lib/services/result.model';
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service';

@Component({
  selector: 'site-impact-top-creative',
  templateUrl: './site-impact-top-creative.component.html',
  styleUrls: ['./site-impact-top-creative.component.less'],

})
export class SiteImpactTopCreativeComponent {
  loading: boolean = true;
  creativeGroups;
  totals: Partial<Readonly<Record<string, MetricValue>>>;
  kpis: string[] = ['opens', 'open_rate', 'clicks', 'ctr'];
  top: boolean = true;
  formatOptions: any = {
    separatorName: 'comma',
  }
  constructor(dataService: TheAdvocateDataService) {
    combineLatest([
      dataService.siteImpactTotals(),
      dataService.siteImpactBreakdownItems(),
    ]).subscribe(([totals, creatives]) => {
      this.loading = false;
      this.totals = totals;
      this.creativeGroups = creatives
        .sortBy(c => -c.metrics.clicks.value)[0];
    });
  }

  setFormatting(format: any): any {
    return Object.merge(this.formatOptions, format);
  }
}
