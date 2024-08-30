import {Component} from '@angular/core';
import {FundaDataService, LineItem} from '../../services/funda-data.service';
import { SettingsService } from '../../services/settings.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'line-items',
  templateUrl: './line-items.slide.html',
  styleUrls: ['./line-items.slide.less']
})
export class LineItemsSlide {
  loading = true;
  lineItemGroups: LineItem[][];
  moatExists = false;

  currencyOptions = {
    currency: 'EUR',
  };
  templateType: string = 'consumers';

  constructor(dataService: FundaDataService, settingsService: SettingsService
    ) {
    combineLatest([  
      dataService.dfpLineItems(),
      settingsService.settingData('template-type')
    ])
    .subscribe(([lineItems, templateType]) => {
      this.loading = false;
      this.templateType = templateType && templateType.data;
      this.lineItemGroups = lineItems
        .sortBy('metrics.dfp_total_line_item_level_impressions', true)
        .inGroupsOf(5)
        .map('compact');
    })
  }
}
