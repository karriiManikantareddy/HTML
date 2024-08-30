import { Component } from "@angular/core";
import { SettingsService } from '../../services/settings.service'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'footer-line',
  templateUrl: './footer-line.component.html',
  styleUrls: ['./footer-line.component.less']
})
export class FooterLineComponent {
  templateType: string = 'consumers'

  constructor (settingsService: SettingsService) {
    combineLatest<any>(settingsService.settingData('template-type'))
      .subscribe(([templateType]) => {
        this.templateType = templateType && templateType.data
      })
  }
}