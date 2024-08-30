import {Injectable} from '@angular/core'

@Injectable()
export class EwScrippsVariables {
  readonly colors = {
    primary: '#3497DB',
    secondary: '#eeeff7',
    impressions: '#c3d2f8',
    clicks: '#2339e3',
    chart: [
      '#F16A42',
      '#F4425B',
      '#FCA311'
    ],


    map: {
      min: '#eeeff7',
      max: '#3497DB',
    }
  }
}
