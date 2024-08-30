import { Injectable } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { Observable } from 'rxjs'
import { SettingData, Setting } from 'projects/settings-module/src/lib/setting.model'

export interface ColorTheme {
  primary_color: string,
  secondary_color: string,
  cover_image: string,
  divider_image: string,
  cover_text_location: string,
  thank_you_location: string,
}

const colorTheme: Setting<string> = {
  id: 'colorTheme',
  name: 'Color Theme',
  componentType: 'dropdown',
  component: {
    ui: [
      { id: 'houston', name: 'Houston Chronicle' },
      { id: 'connecticut', name: 'Connecticut' },
      { id: 'san_antionio', name: 'San Antionio' },
      { id: 'san_francisco', name: 'San Francisco' },
      { id: 'albany', name: 'Albany' },
      { id: 'communities', name: 'Communities' },
    ],
    styling: { order: 1 },
  },
  defaultState: 'houston',
  data: [
    {
      componentStateId: 'houston',
      data: <ColorTheme> {
        primary_color: '#033242',
        secondary_color: '#F9C70C',
        cover_image: 'hc_cover.png',
        divider_image: 'hc_background.png',
        cover_text_location: 'top-left',
        thank_you_location: 'mid-left',
      },
    },
    {
      componentStateId: 'connecticut',
      data:  <ColorTheme> {
        primary_color: '#4FCDFA',
        secondary_color: '#F9C70C',
        cover_image: 'cmg_cover.png',
        divider_image: 'cmg_divider.png',
        cover_text_location: 'mid-mid',
        thank_you_location: 'mid-mid',
      },
    },
    {
      componentStateId: 'san_antionio',
      data:  <ColorTheme> {
        primary_color: '#275B79',
        secondary_color: '#F9C70C',
        cover_image: 'sa_cover.png',
        divider_image: 'sa_divider.png',
        cover_text_location: 'mid-left',
        thank_you_location: 'bottom-mid',
      },
    },
    {
      componentStateId: 'san_francisco',
      data:  <ColorTheme> {
        primary_color: '#73C7F0',
        secondary_color: '#F9C70C',
        cover_image: 'sf_cover.png',
        divider_image: 'sf_divider.png',
        cover_text_location: 'mid-left',
        thank_you_location: 'mid-left',
      },
    },
    {
      componentStateId: 'albany',
      data:  <ColorTheme> {
        primary_color: '#0065A4',
        secondary_color: '#F9C70C',
        cover_image: 'albany_cover.png',
        divider_image: 'albany_divider.png',
        cover_text_location: 'bottom-mid',
        thank_you_location: 'mid-left',
      },
    },
    {
      componentStateId: 'communities',
      data:  <ColorTheme> {
        primary_color: '#4FCDFA',
        secondary_color: '#F9C70C',
        cover_image: 'communities_cover.png',
        divider_image: 'communities_divider.png',
        cover_text_location: 'top-left',
        thank_you_location: 'mid-left',
      },
    },
  ],
}

@Injectable()
export class HearstNewspapersSettingsService {
  private settings: Setting[] = [colorTheme]

  constructor(private settingService: SettingState) {
    settingService.init(this.settings)
  }

  settingData(settingName: string): Observable<SettingData | null> {
    return this.settingService.settingData(settingName)
  }
}
