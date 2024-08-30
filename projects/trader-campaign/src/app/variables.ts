import {Injectable} from '@angular/core'

@Injectable()
export class TraderVariables {
  readonly colors = {
    primary: '#ED1C24',
    secondary: '#eeeff7',
    impressions: '#FF6E81',
    clicks: '#0F68C9',
    lightBlue: '#27BACF',

    map: {
      min: '#eeeff7',
      max: '#FF6E81',
    }
  }
}
