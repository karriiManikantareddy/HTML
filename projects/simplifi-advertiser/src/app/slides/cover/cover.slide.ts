import {Component} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'
import {SimplifiDataService, Metadata} from '../../services/simplifi-data.service'

@Component({
  selector: 'cover',
  templateUrl: './cover.slide.html',
  styleUrls: ['./cover.slide.less']
})
export class CoverSlide {
  loading = true
  metadata?: Metadata
  logo: string = 'assets/img/lighthouse.png'
  theme: string = 'dark'
  background: string
  textColor: string
  currentDate: Date = new Date()
  dateOptions: any = {pattern:  '{M}.{d}.{year}'}

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
  ) {
    this.background = variables.colors[this.theme].backgroundCover
    this.textColor = variables.colors[this.theme].coverText
    dataService
      .metadata()
      .subscribe(metadata => {
        this.loading = false
        this.metadata = metadata
      })
    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
      this.background = variables.colors[this.theme].backgroundCover
      this.textColor = variables.colors[this.theme].coverText
    })
  }
}
