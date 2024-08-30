import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class AdevintaDataService {
  dates: Dates

  abstract metadata(): Observable<any>
  abstract totals(): Observable<any>
  abstract clickSeries(): Observable<any>
  abstract viewabilitySeries(): Observable<any>
  abstract lineItems(): Observable<any>
  abstract creatives(): Observable<any>
  abstract creativeSizes(): Observable<any>
  abstract positions(): Observable<any>
  abstract categories(): Observable<any>
  abstract platforms(): Observable<any>
  abstract countries(): Observable<any>
  abstract regions(): Observable<any>

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
        startDate: this.formatDateString(parts[0]),
        endDate: this.formatDateString(parts[1]),
      }
    }
  }

  private formatDateString(dateString): string {
    const year = dateString.substr(0, 4)
    const month = dateString.substr(4, 2)
    const day = dateString.substr(6, 2)

    return [year, month, day].join('-')
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
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly metrics: any
  ) {
  }
}

export class Category {
  readonly name: string
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['category'] || id
    this.metrics = metrics
  }
}

export class Country {
  readonly code: string
  readonly name: string
  readonly metrics: any

  constructor(code, name, metrics) {
    this.code = code && code.toLowerCase()
    this.name = name || code
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
  readonly id: string

  constructor(id, data, metrics, sliceId) {
    this.id = sliceId;
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

export class Position {
  readonly name: string
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['position'] || id
    this.metrics = metrics
  }
}

export class Region {
  code: string
  readonly name: string
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['region'] || id
    this.metrics = metrics
    this.code = ''
  }
}
