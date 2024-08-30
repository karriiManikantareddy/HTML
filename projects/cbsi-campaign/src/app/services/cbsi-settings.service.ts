import { Injectable } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { Observable } from 'rxjs'
import { SettingData, Setting } from 'projects/settings-module/src/lib/setting.model'

const metrics: Setting<string> = {
  id: 'metricTypes',
  name: '1st or 3rd Party',
  componentType: 'dropdown',
  component: {
    ui: [
      { id: 'both', name: '1st and 3rd Party Metrics' },
      { id: 'first', name: '1st Party Metrics' },
      { id: 'third', name: '3rd Party Metrics' },
    ],
    styling: { order: 0 },
  },
  defaultState: 'both',
  data: [
    {
      componentStateId: 'both',
      data: 'both',
    },
    {
      componentStateId: 'first',
      data: 'first',
    },
    {
      componentStateId: 'third',
      data: 'third',
    },
  ],
}

const impressionType: Setting<string> = {
  id: 'impressionType',
  name: 'Impressions type',
  componentType: 'dropdown',
  component: {
    ui: [
      { id: 'billable_impressions', name: 'Billable Party' },
      { id: 'first_party_impressions', name: '1st Party' },
      { id: 'rbp_billable_imps', name: 'RBP Billable' },
    ],
    styling: { order: 0 },
  },
  defaultState: 'billable_impressions',
  data: [
    {
      componentStateId: 'billable_impressions',
      data: 'billable_impressions',
    },
    {
      componentStateId: 'first_party_impressions',
      data: 'first_party_impressions',
    },
    {
      componentStateId: 'rbp_billable_imps',
      data: 'rbp_billable_imps',
    },
  ]
}

@Injectable()
export class CbsiSettingsService {
  settings: Setting[] = [metrics, impressionType]

  constructor(private settingService: SettingState) {
    settingService.init(this.settings)
  }

  settingData(settingName: string): Observable<SettingData | null> {
    return this.settingService.settingData(settingName)
  }
}
