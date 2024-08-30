import {Injectable} from '@angular/core'

@Injectable()
export class BurtVariables {
  readonly colors = {
    primary: '#4e759f',
    secondary: '#fc4d87',
    impressions: '#fc4d87',
    clicks: '#4e759f',

    map: {
      min: '#12142a',
      max: '#4e759f',
    }
  }
}
