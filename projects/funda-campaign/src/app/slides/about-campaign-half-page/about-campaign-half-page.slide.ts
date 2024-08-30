import {Component} from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'about-campaign-half-page',
  templateUrl: './about-campaign-half-page.slide.html',
  styleUrls: ['./about-campaign-half-page.slide.less']
})
export class AboutCampaignHalfPageSlide { 
  templateType: string = 'consumers';
  align: string = 'left';

  constructor (settingsService: SettingsService) {
    combineLatest<any>(settingsService.settingData('template-type'))
      .subscribe(([templateType]) => {
        this.templateType = templateType && templateType.data;
      })
  }
}
