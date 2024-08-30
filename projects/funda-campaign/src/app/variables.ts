import { Injectable } from "@angular/core";
@Injectable()
export class FundaVariables {
  readonly colors = {
    consumers: {
      impressions: '#82c9ee',
      ctr: '#f9b000',
    },
    business: {
      impressions: '#8cb5e1',
      ctr: '#f9b000',
    },
    map: {
      consumers: {
        min: '#ffe6b5',
        max: '#de9104',
      },
      business: {
        min: '#daedf9',
        max: '#8cb5e1',
      }
    }
  }
}