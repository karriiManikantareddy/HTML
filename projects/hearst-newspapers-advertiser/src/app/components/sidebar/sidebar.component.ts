import { Component, Input } from '@angular/core'
import {HearstNewspapersSettingsService, ColorTheme} from '../../services/hearst-newspapers-settings.service'

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent {
  @Input() loading: boolean = true
  @Input() text: string
  colorTheme: ColorTheme

  constructor(settingsService: HearstNewspapersSettingsService) {
    settingsService.settingData('colorTheme').subscribe(colorTheme => {
      this.colorTheme = colorTheme['data']
    })
  }
}
