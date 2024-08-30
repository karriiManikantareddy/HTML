import { Component, Input } from "@angular/core";
import { SettingsService } from '../../services/settings.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'header-line',
  templateUrl: './header-line.component.html',
  styleUrls: ['./header-line.component.less']
})
export class HeaderLineComponent {
  templateType: string = 'consumers';
  @Input() align: string;

  constructor (settingsService: SettingsService) {
    combineLatest<any>(settingsService.settingData('template-type'))
      .subscribe(([templateType]) => {
        this.templateType = templateType && templateType.data;
      })
  }
}
