import { Component } from '@angular/core'
import { Setting } from 'projects/settings-module/src/lib/setting.model'
import { SettingUpdaterState } from '../../setting-updater.state'

@Component({
  selector: 'preview-settings',
  templateUrl: './preview-settings.component.html',
})
export class PreviewSettingsComponent {
  settings: Setting[] = []
  constructor(private settingState: SettingUpdaterState) {
    settingState.getSettings().subscribe(settings => {
      this.settings = settings
    })
  }

  updateSetting(setting: Setting, event: any) {
    this.settingState.updateState({ settingId: setting.id, newState: event })
  }
}
