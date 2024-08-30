import { Component, Input } from '@angular/core'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.less']
})
export class DividerComponent {
  @Input() loading: boolean = true
  @Input() name: string
  colorTheme: ColorTheme

  constructor(settingsService: HearstNewspapersSettingsService) {
    settingsService.settingData('colorTheme').subscribe(colorTheme => {
      this.colorTheme = colorTheme['data']
    })
  }
}
