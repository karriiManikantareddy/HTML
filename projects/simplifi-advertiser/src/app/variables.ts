import {Injectable} from '@angular/core'

@Injectable()
export class SimplifiVariables {
  readonly colors = {
    dark: {
      backgroundCover: '#000',
      coverText: '#fff',
      secondary: '#E05534',
      primary: '#000',
      impressions: '#000',
      clicks: '#2339e3',
      chart: [
        '#00EBC1',
        '#FCE40D',
        '#FC710D',
        '#DB0A61',
        '#0000FF',
        '#2A7F62',
      ],
      map: {
        min: '#fff',
        max: '#20FB0C',
      }
    },
    light: {
      backgroundCover: '#fff',
      coverText: '#000',
      primary: '#000',
      secondary: '#E05534',
      impressions: '#000',
      clicks: '#2339e3',
      chart: [
        '#00EBC1',
        '#FCE40D',
        '#FC710D',
        '#DB0A61',
        '#0000FF',
        '#2A7F62',
      ],

      map: {
        min: '#fff',
        max: '#20FB0C',
      }
    }
  }
}
