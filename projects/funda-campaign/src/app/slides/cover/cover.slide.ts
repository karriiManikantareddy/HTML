import {Component} from '@angular/core'
import {FundaDataService, Metadata} from '../../services/funda-data.service'
import { SettingsService } from '../../services/settings.service'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata: Metadata
  templateType: string = 'consumers'
  dateFormat = { pattern: '{dd}-{MM}-{year}' }
  today = new Date();
  constructor(dataService: FundaDataService, settingsService: SettingsService) {
    combineLatest<any>(
      dataService.dfpCampaign(),
      settingsService.settingData('template-type'),
    )
    .subscribe(([metadata, templateType]) => {
      this.loading = false
      this.templateType = templateType && templateType.data
      if (!metadata) return
       metadata.name = metadata.name.titleize()
       this.metadata = metadata
     })
  }
  whiteBlockStyles(advertiser,toggle) {
    let maxWidth;
    let margin;
    let padding;
    let width;
    if (toggle === 'title'){
      maxWidth = (advertiser.length > 20 && advertiser.length < 45) ? '80%' : (advertiser.length < 20) ? '45%' : '100%';
      padding = advertiser.length > 45 ? '20px 60px 20px 70px' : '25px 75px 25px 75px';
      return {
        maxWidth : maxWidth,
        padding : padding
      }
    }
    else {
      margin = (advertiser.length > 35 && advertiser.length < 42) ? '1% 1% 1% 57%' : (advertiser.length < 35) ? '5% 1% 1% 57%' : '-5% 1% 1% 57%';
      width = advertiser.length > 45 ? '42%' : '45%';
      return {
        margin : margin,
        width : width
      }
    }
  }
}
