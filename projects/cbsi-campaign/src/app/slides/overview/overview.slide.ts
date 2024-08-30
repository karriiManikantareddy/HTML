import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import { CbsiDataService, Metadata } from '../../services/cbsi-data.service'
import { CbsiSettingsService } from '../../services/cbsi-settings.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  avSpend = 0
  contractedSpend = 0
  deliveredSpend = 0
  loading = true
  metadata: Metadata
  totals: any
  avImpressions: Number
  impressionType: string
  description: string
  sumOperativeQuantity: any
  constructor(
    dataService: CbsiDataService,
    settingsState: CbsiSettingsService,
  ) {
    combineLatest([
      dataService.totals(),
      dataService.metadata(),
      dataService.lineItems(),
      settingsState.settingData('impressionType')
    ]).subscribe(([totals, metadata, lineItems, impressionType]) => {
      this.loading = false;
      this.totals = totals;
      this.metadata = metadata;
      this.impressionType = impressionType.data;
      if (lineItems && lineItems.length) {
        this.totals.rbp_billable_imps = 0;
        this.deliveredSpend = 0;
        lineItems.forEach(lineItem => {
          this.deliveredSpend += ((parseFloat(lineItem.data.operative_net_unit_cost) / 1000) * lineItem.metrics[this.impressionType]) || 0
          this.totals.rbp_billable_imps += Number(lineItem.metrics.rbp_billable_imps);
        })

        this.sumOperativeQuantity = lineItems.sum(lineItem => Number(lineItem.data['operative_quantity'] || 0))
        this.avImpressions = Math.max(totals['billable_impressions'] - this.sumOperativeQuantity, 0)
      }
      this.avSpend = Math.max(this.deliveredSpend - this.metadata.netOrderCost, 0);
      this.description = 'Paramount Content on O&O apps, websites & MVPD Skinny Bundles- '+Number(totals && totals.desktop_impression_rate ? totals.desktop_impression_rate * 100 : 0).toFixed(2)+
      '<br>Curated Pluto Content- '+Number(totals && totals.mobile_impression_rate ? totals.mobile_impression_rate * 100 : 0).toFixed(2)+'<br>Paramount O&O Content on Pluto- '+Number(totals && totals.tv_glass_impression_rate ? totals.tv_glass_impression_rate * 100 : 0).toFixed(2);
    })
  }
}
