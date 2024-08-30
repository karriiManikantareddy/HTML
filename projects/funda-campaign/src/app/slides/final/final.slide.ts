import {Component} from '@angular/core'
import { SettingsService } from '../../services/settings.service'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'final',
  templateUrl: './final.slide.html',
  styleUrls: ['./final.slide.less']
})
export class FinalSlide {
  templateType: string = 'consumers'

  constructor (settingsService: SettingsService) {
    combineLatest<any>(settingsService.settingData('template-type'))
      .subscribe(([templateType]) => {
        this.templateType = templateType && templateType.data
      })
  }
 }
