import {Component, Input} from '@angular/core'
import {FundaDataService, Creative} from '../../services/funda-data.service'
import { combineLatest } from 'rxjs';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'top-creatives',
  templateUrl: './top-creatives.slide.html',
  styleUrls: ['./top-creatives.slide.less']
})
export class TopCreativesSlide {
  loading = true;
  lineItemGroups: Creative[][];
  moatExists = false;
  templateType: string = 'consumers';

  constructor(dataService: FundaDataService, settingsService: SettingsService
    ) {
    combineLatest([  
      dataService.dfpCreatives(),
      settingsService.settingData('template-type')
    ])
    .subscribe(([lineItems, templateType]) => {
    this.loading = false;
    this.templateType = templateType && templateType.data;
    this.lineItemGroups = lineItems
      .sortBy('metrics.dfp_total_line_item_level_impressions', true)
      .inGroupsOf(5)
      .map('compact');
    });
  }
}
