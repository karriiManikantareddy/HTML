import { Injectable } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { Observable } from 'rxjs'
import { SettingData, Setting } from 'projects/settings-module/src/lib/setting.model'
import { SimplifiDataService } from '../services/simplifi-data.service'

const campaignTactic: Setting<string> = {
  id: 'campaignTactic',
  name: 'Campaign Goal',
  componentType: 'dropdown',
  defaultState: 'ctr_vcr',
  component: {
    ui: [
      { id: 'vcr', name: 'VCR' },
      { id: 'vcr_actions', name: 'VCR, Visits' },
      { id: 'vcr_actions_visits', name: 'VCR, Online Visits, Visits' },
      { id: 'ctr', name: 'Clicks, CTR' },
      { id: 'ctr_vcr', name: 'CLicks, CTR, VCR' },
      { id: 'ctr_actions', name: 'Clicks, CTR, Online Visits, Visits' },
      { id: 'ctr_cpc', name: 'Clicks, CTR, CPC' },
      { id: 'ctr_cpc_actions', name: 'Clicks, CTR, CPC, CPA, Online Visits, Visits' },
      { id: 'all', name: 'Clicks, CTR, CPC, VCR, CPA, Online Visits, Visits' },
    ],
    styling: { order: 1 },
  },
  data: [
    {
      componentStateId: 'vcr',
      data: 'vcr',
    },
    {
      componentStateId: 'vcr_actions',
      data: 'vcr_actions',
    },
    {
      componentStateId: 'vcr_actions_visits',
      data: 'vcr_actions_visits',
    },
    {
      componentStateId: 'ctr',
      data: 'ctr',
    },
    {
      componentStateId: 'ctr_vcr',
      data: 'ctr_vcr',
    },
    {
      componentStateId: 'ctr_actions',
      data: 'ctr_actions',
    },
    {
      componentStateId: 'ctr_cpc',
      data: 'ctr_cpc',
    },
    {
      componentStateId: 'ctr_cpc_actions',
      data: 'ctr_cpc_actions',
    },
    {
      componentStateId: 'all',
      data: 'all',
    },
  ],
}

const theme: Setting<string> = {
  id: 'theme',
  name: 'Theme',
  componentType: 'dropdown',
  defaultState: 'dark',
  component: {
    ui: [
      { id: 'dark', name: 'Dark' },
      { id: 'light', name: 'Light' },
    ],
    styling: { order: 1 },
  },
  data: [
    {
      componentStateId: 'dark',
      data: 'dark',
    },
    {
      componentStateId: 'light',
      data: 'light',
    },
  ],
}

const primaryColor: Setting<string> = {
  id: 'primaryColor',
  name: 'Primary Color',
  componentType: 'dropdown',
  defaultState: 'burnt_orange',
  component: {
    ui: [
      { id: 'burnt_orange', name: 'Burnt Orange' },
      { id: 'green', name: 'Green' },
      { id: 'blue', name: 'Blue' },
      { id: 'red', name: 'Red' },
      { id: 'black', name: 'Black' },
    ],
    styling: { order: 1 },
  },
  data: [
    {
      componentStateId: 'burnt_orange',
      data: '#E05534',
    },
    {
      componentStateId: 'green',
      data: '#21fc02',
    },
    {
      componentStateId: 'blue',
      data: '#0000FF',
    },
    {
      componentStateId: 'red',
      data: '#FF0000',
    },
    {
      componentStateId: 'black',
      data: '#000',
    },
  ],
}

@Injectable()
export class SimplifiSettingsService {
  private dmaSetting: Setting<string> = {
    id: 'dma',
    name: 'DMA',
    componentType: 'dropdown',
    defaultState: '',
    component: {
      ui: [],
      styling: { order: 1 },
    },
    data: [],
  };
  private settings: Setting[] = [campaignTactic, theme, primaryColor, this.dmaSetting]
  constructor(private settingService: SettingState, dataService: SimplifiDataService
    ) {
    settingService.init(this.settings)
    dataService.simplifiTopDmaList().subscribe(dma => {
      this.dmaSetting.data = dma.map(item => ({
        componentStateId: item.data,
        data: item.data,
      }));
      this.dmaSetting.component.ui = dma.map(item => ({
        id: item.data,
        name: item.data,
      }));
      this.dmaSetting.defaultState = dma[0].data;
      this.settingService.init(this.settings);

    })
  }

  settingData(settingName: string): Observable<SettingData | null> {
    return this.settingService.settingData(settingName)
  }
}
