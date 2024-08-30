import { Injectable } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { Observable } from 'rxjs'
import { SettingData, Setting } from 'projects/settings-module/src/lib/setting.model'

const settings: [Setting<string>] = [
  {
    id: 'template-type',
    name: 'Template type',
    componentType: 'dropdown',
    component: {
      ui: [
        { id: 'consumers', name: 'Consumers' },
        { id: 'business', name: 'Business' },
      ],
      styling: { order: 0 },
    },
    defaultState: 'consumers',
    data: [
      {
        componentStateId: 'consumers',
        data: 'consumers',
      },
      {
        componentStateId: 'business',
        data: 'business',
      },
    ],
  },
]

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private settingService: SettingState) {
    settingService.init(settings)
  }

  settingData(settingName: string): Observable<SettingData | null> {
    return this.settingService.settingData(settingName)
  }
}