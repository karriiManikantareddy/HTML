import {Injectable} from '@angular/core'

@Injectable()
export class BurtVariables {
  readonly colors = {
    primary_red: '#EE2824',
    primary_blue: '#0292F4',
    secondary_gray: '#707071',
    secondary_black: '#333333',
    secondary_purple: '#6C3294',
    tertiary_purple: '#B62785',
    tertiary_red: '#A31347',

    map: {
      min: '#d2e7fc',
      max: '#0955a1',
    }
  }
}

export const SkipItems = ['*999999*', '999999', 'TEST']
