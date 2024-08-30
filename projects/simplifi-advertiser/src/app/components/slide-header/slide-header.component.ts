import { Component, Input } from '@angular/core'
import {SimplifiDataService, Metadata} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'
import {Variables} from 'projects/template-module/src/lib/variables'

@Component({
  selector: 'slide-header',
  templateUrl: './slide-header.component.html',
  styleUrls: ['./slide-header.component.less']
})
export class SlideHeaderComponent {
  @Input() loading: boolean = true
  @Input() text: string
  logo: string = 'assets/img/logo.svg'
  metadata?: Metadata
  currentDate: Date = new Date()
  dateOptions: any = {pattern:  '{M}.{d}.{year}'}
  theme: string = 'light'
  background: string
  textColor: string

  constructor(
    private dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
    ) {
    dataService
      .metadata()
      .subscribe(metadata => {
        this.metadata = metadata
      })
      settingsService.settingData('theme').subscribe(theme => {
        this.theme = theme.data
        this.textColor = variables.colors[this.theme].coverText
      })
  }

  ngOnInit() {}
}
