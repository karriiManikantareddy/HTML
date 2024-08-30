import {Component} from '@angular/core'
import { combineLatest } from 'rxjs'
import {HearstNewspapersDataService, Metadata} from '../../services/hearst-newspapers-data.service'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata?: Metadata
  colorTheme: ColorTheme

  constructor(dataService: HearstNewspapersDataService, settingsService: HearstNewspapersSettingsService) {
    combineLatest([
      dataService.metadata(),
      settingsService.settingData('colorTheme'),
    ]).subscribe(([metadata, colorTheme]) => {
      this.loading = false
      this.metadata = metadata
      this.colorTheme = colorTheme['data']
    })
  }
}
