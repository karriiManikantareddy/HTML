import { Injectable } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { Observable } from 'rxjs'
import { SettingData, Setting } from 'projects/settings-module/src/lib/setting.model'

const metrics: Setting<string> = {
  id: 'metricTypes',
  name: '1st or 3rd Party',
  componentType: 'dropdown',
  defaultState: 'both',
  component: {
    ui: [
      { id: 'both', name: '1st and 3rd Party Metrics' },
      { id: 'first', name: '1st Party Metrics' },
      { id: 'third', name: '3rd Party Metrics' },
    ],
    styling: { order: 0 },
  },
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

const colorTheme: Setting<string> = {
  id: 'colorTheme',
  name: 'Color Theme',
  componentType: 'dropdown',
  component: {
    ui: [
      { id: 'blue/green', name: 'Blue/Green' },
      { id: 'green/orange', name: 'Green/Orange' },
      { id: 'reds', name: 'Reds' },
      { id: 'blues', name: 'Blues' },
      { id: 'greens', name: 'Greens' },
    ],
    styling: { order: 1 },
  },
  defaultState: 'blue/green',
  data: [
    {
      componentStateId: 'blue/green',
      data: 'blue/green',
    },
    {
      componentStateId: 'green/orange',
      data: 'green/orange',
    },
    {
      componentStateId: 'reds',
      data: 'reds',
    },
    {
      componentStateId: 'blues',
      data: 'blues',
    },
    {
      componentStateId: 'greens',
      data: 'greens',
    },
  ],
}

const lineItemSort: Setting<string> = {
  id: 'sortTypes',
  name: 'Sort Line Items by',
  componentType: 'dropdown',
  defaultState: 'dfp_total_line_item_level_impressions',
  component: {
    ui: [
      { id: 'dfp_total_line_item_level_impressions', name: 'Impressions' },
      { id: 'dfp_total_active_view_viewable_impressions', name: 'Viewability' },
      { id: 'dfp_ctr', name: 'CTR' },
      { id: 'dfp_vcr', name: 'VCR' },
    ],
    styling: { order: 0 },
  },
  data: [
    {
      componentStateId: 'dfp_total_line_item_level_impressions',
      data: 'dfp_total_line_item_level_impressions',
    },
    {
      componentStateId: 'dfp_total_active_view_viewable_impressions',
      data: 'dfp_total_active_view_viewable_impressions',
    },
    {
      componentStateId: 'dfp_ctr',
      data: 'dfp_ctr',
    },
    {
      componentStateId: 'dfp_vcr',
      data: 'dfp_vcr',
    },
  ],
}

const topLineItemSort: Setting<string> = {
  id: 'topLineItemsSortTypes',
  name: 'Sort Top Line Items by',
  componentType: 'dropdown',
  defaultState: 'dfp_total_line_item_level_impressions',
  component: {
    ui: [
      { id: 'dfp_total_line_item_level_impressions', name: 'Impressions' },
      { id: 'dfp_total_line_item_level_clicks', name: 'Clicks' },
      { id: 'dfp_total_active_view_viewable_impressions', name: 'Viewability' },
      { id: 'dfp_ctr', name: 'CTR' },
      { id: 'dfp_vcr', name: 'VCR' },
    ],
    styling: { order: 0 },
  },
  data: [
    {
      componentStateId: 'dfp_total_line_item_level_impressions',
      data: 'dfp_total_line_item_level_impressions',
    },
    {
      componentStateId: 'dfp_total_line_item_level_clicks',
      data: 'dfp_total_line_item_level_clicks',
    },
    {
      componentStateId: 'dfp_total_active_view_viewable_impressions',
      data: 'dfp_total_active_view_viewable_impressions',
    },
    {
      componentStateId: 'dfp_ctr',
      data: 'dfp_ctr',
    },
    {
      componentStateId: 'dfp_vcr',
      data: 'dfp_vcr',
    },
  ],
}

const backgroundcolorTheme: Setting<string> = {
  id: 'backgroundcolorTheme',
  name: 'Background Color Theme',
  componentType: 'dropdown',
  component: {
    ui: [
      { id: 'white', name: 'White' },
      { id: 'black', name: 'Black' },
    ],
    styling: { order: 1 },
  },
  defaultState: 'white',
  data: [
    {
      componentStateId: 'white',
      data: 'white',
    },
    {
      componentStateId: 'black',
      data: 'black',
    },
  ],
}


@Injectable()
export class NytSettingsService {
  private settings: Setting[] = [metrics, colorTheme, lineItemSort, topLineItemSort, backgroundcolorTheme]

  constructor(private settingService: SettingState) {
    settingService.init(this.settings)
  }

  settingData(settingName: string): Observable<SettingData | null> {
    return this.settingService.settingData(settingName)
  }
}
