import { Injectable } from "@angular/core";
@Injectable()
export class AdevintaVariables {
  readonly colors = {
    primary: '#2339e3',
    secondary: '#eeeff7',
    impressions: '#c3d2f8',
    clicks: '#2339e3',
    ctr: '#2339e3',
    viewability: '#2339e3',

    black: {
      primary: '#000000',
      secondary: '#bfbfbf',
    },
    red: {
      primary: '#C20000',
      secondary: '#FFBDBD',
    },
    blue: {
      primary: '#0100C5',
      secondary: '#BDBDFF',
    },
  }
}
