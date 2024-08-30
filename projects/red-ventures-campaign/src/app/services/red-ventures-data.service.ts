import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class RedVenturesDataService {
  abstract metadata(): Observable<Metadata>
  abstract totals(): Observable<any>
  abstract series(): Observable<any>

  dates: Dates

  constructor(private window: any) {
    this.dates = this.datesFromInterval(location)
  }

  updateDates(startDate: string, endDate: string) {
    if (this.dates.startDate == null || startDate > this.dates.startDate) {
      this.dates.startDate = startDate
    }

    if (this.dates.endDate == null || endDate < this.dates.endDate) {
      this.dates.endDate = endDate
    }
  }

  private datesFromInterval(location): Dates {
    const params = <any> Object.fromQueryString(location.search)
    const interval = params['interval']
    if (interval == null) {
      return {}
    } else {
      const parts = interval.toString().split('-')
      return {
        startDate: parts[0],
        endDate: parts[1],
      }
    }
  }
}

export class Metadata {
  readonly name: string
  readonly advertiser: string
  readonly startDate: string
  readonly endDate: string

  constructor(data, advertiserData) {
    this.name = data['campaign']
    this.advertiser = advertiserData['advertiser']
    this.startDate = data['start_date']
    this.endDate = data['end_date'] ? data['end_date'] : Date.create('yesterday')
  }
}
