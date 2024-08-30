import { Injectable } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { Observable } from 'rxjs'
import { SettingData, Setting } from 'projects/settings-module/src/lib/setting.model'

const lineItemSort: Setting<string> = {
  id: 'sortTypes',
  name: 'Sort Line Items by',
  componentType: 'dropdown',
  defaultState: 'gam_impressions',
  component: {
    ui: [
      { id: 'gam_impressions', name: 'Impressions' },
      { id: 'gam_viewability', name: 'Viewability' },
      { id: 'ctr', name: 'CTR' }
    ],
    styling: { order: 0 },
  },
  data: [
    {
      componentStateId: 'gam_impressions',
      data: 'gam_impressions',
    },
    {
      componentStateId: 'gam_viewability',
      data: 'gam_viewability',
    },
    {
      componentStateId: 'ctr',
      data: 'ctr',
    }
  ],
}

const chartColor: Setting<string> = {
  id: 'chartColor',
  name: 'Chart Color',
  componentType: 'dropdown',
  component: {
    ui: [
      { id: 'blue', name: 'Blue' },
      { id: 'black', name: 'Black' },
      { id: 'red', name: 'Red' },
    ],
    styling: { order: 1 },
  },
  defaultState: 'blue',
  data: [
    {
      componentStateId: 'blue',
      data: 'blue',
    },
    {
      componentStateId: 'black',
      data: 'black',
    },
    {
      componentStateId: 'red',
      data: 'red',
    },
  ],
};

@Injectable()
export class AdevintaSettingsService {
  private settings: Setting[] = [lineItemSort, chartColor];

  constructor(private settingService: SettingState) {
    settingService.init(this.settings)
  }

  settingData(settingName: string): Observable<SettingData | null> {
    return this.settingService.settingData(settingName)
  }
}
