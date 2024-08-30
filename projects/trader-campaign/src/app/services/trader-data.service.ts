import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class TraderDataService {
  abstract metadata(): Observable<any>
  abstract totals(): Observable<any>
  abstract series(): Observable<any>
  abstract lineItems(): Observable<any>
  abstract creatives(): Observable<any>
  abstract platforms(): Observable<any>
  abstract regions(): Observable<any>

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
  public readonly startDate: string
  public readonly endDate: string

  constructor(
    public readonly name: string,
    readonly dates: Dates = null
  ) {
    this.startDate = dates.startDate
    this.endDate = dates.endDate
  }
}

export class LineItem {
  id: string
  name: string
  campaignName: string
  metrics: any
  contractedUnits: number

  constructor(id, data, campaignName, metrics) {
    this.id = id
    this.name = data['line_item']
    this.contractedUnits = data['contracted_units']
    this.campaignName = campaignName
    this.metrics = metrics
  }
}

export class Creative {
  readonly name: string
  readonly assetUrl: string
  readonly previewUrl: string
  readonly width: number
  readonly height: number
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['creative'] || id
    this.assetUrl = data['asset_url']
    this.previewUrl = data['preview_url']
    this.width = data['width']
    this.height = data['height']
    this.metrics = metrics
  }
}

export class CreativeSize {
  readonly name: string
  readonly metrics: any
  readonly shareOfs: any

  constructor(id, data, metrics, shareOfs) {
    this.name = data['creative_size'] || id
    this.metrics = metrics
    this.shareOfs = shareOfs
  }
}

export class Platform {
  readonly name: string
  readonly metrics: any
  readonly shareOfs: any

  constructor(data, metrics, shareOfs, dimension) {
    this.name = data[dimension]
    this.metrics = metrics
    this.shareOfs = shareOfs
  }
}

export class Region {
  readonly name: string
  readonly code: string
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['region'] || id
    this.code = CANADA_REGIONS[this.name.toLowerCase()]
    this.metrics = metrics
  }
}

const CANADA_REGIONS = {
  'alberta': 'ca-ab',
  'british columbia': 'ca-bc',
  'manitoba': 'ca-mb',
  'new brunswick': 'ca-nb',
  'newfoundland and labrador': 'ca-nl',
  'nova scotia': 'ca-ns',
  'northwest territories': 'ca-nt',
  'nunavut': 'ca-nu',
  'ontario': 'ca-on',
  'prince edward island': 'ca-pe',
  'quebec': 'ca-qc',
  'saskatchewan': 'ca-sk',
  'yukon': 'ca-yt'
}
