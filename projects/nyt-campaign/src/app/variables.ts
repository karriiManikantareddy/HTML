import {Injectable} from '@angular/core'

@Injectable()
export class NytVariables {
  readonly colors = {
    blank: '#eeeff7',
    map: {
      min: '#fdfed9',
    },
    themes: {
      'blue/green': {
        primary: '#40b6c4',
        secondary: '#d3eed4',
        tertiary: '#9ce0b7',
        quaternary: '#6cd2b8',
      },
      'green/orange': {
        primary: '#D36135',
        secondary: '#7FB069',
        tertiary: '#c79949',
        quaternary: '#bcba5b',
      },
      reds: {
        primary: '#960808',
        secondary: '#c42c06',
        tertiary: '#620d09',
        quaternary: '#430d05',
      },
      blues: {
        primary: '#1b27ab',
        secondary: '#3249D2',
        tertiary: '#2c3b77',
        quaternary: '#4152a0',
      },
      greens: {
        primary: '#4f8253',
        secondary: '#8DB991',
        tertiary: '#456847',
        quaternary: '#67916a',
      },
      black: {
        primary: '#000000'
      },
      white: {
        primary: '#FFFFFF'
      }
    }
  }

  readonly fonts = {
    primary: 'LibreFranklin-Medium',
    header: 'LibreFranklin-Regular',
  }

}
