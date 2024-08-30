import { Component } from '@angular/core';
import { NytSettingsService } from '../app/services/nyt-settings.service'
import { Variables } from 'projects/template-module/src/public_api'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  bgcolor
  backgroundColor
  fontStyling
  subscription: Subscription;
  constructor(settingsService: NytSettingsService, variables: Variables) {
    this.subscription = settingsService.settingData('backgroundcolorTheme').subscribe(
      bgtheme => {
        this.bgcolor = variables.colors.themes[bgtheme.data].primary;
        this.fontStyling = this.bgcolor === '#FFFFFF' ? 'black' : 'white'
      }
    )

  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
