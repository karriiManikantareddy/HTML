import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class HearstMagazinesDataService {
  abstract metadata(): Observable<any>
  abstract totals(): Observable<any>
  abstract socialTotals(): Observable<any>
  abstract series(): Observable<any>
  abstract lineItems(): Observable<any>
  abstract creatives(): Observable<any>
  abstract platforms(): Observable<any>
  abstract socialCreatives(): Observable<any>
  abstract socialPublisherPlatform(): Observable<any>
  abstract brandedContentTotals(): Observable<any>
  abstract brandedContentSeries(): Observable<any>

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
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly metrics: any
  ) {
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
    if (data['size']) {
      const size = JSON.parse(data['size'])
      this.width = size['width']
      this.height = size['height']
    }
    this.metrics = metrics
  }
}

export class SocialCreative {
  readonly name: string
  readonly assetUrl: string
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['creative'] || id
    this.assetUrl = data['thumbnail_url']
    this.metrics = metrics
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
    this.code = US_STATES_DEFINITIONS[this.name.toLowerCase()]
    this.metrics = metrics
  }
}

export class SocialPublisherPlatform {
  constructor(
    public readonly name,
    public readonly metrics,
    public readonly shareOfs,
  ) {}
}

export class Gender {
  constructor(
    public readonly name,
    public readonly metrics,
    public readonly shareOfs,
  ) {}
}

export class Age {
  constructor(
    public readonly name,
    public readonly metrics,
    public readonly shareOfs,
  ) {}
}


const US_STATES_DEFINITIONS = {
  'alabama': 'us-al',
  'alaska': 'us-ak',
  'arizona': 'us-az',
  'arkansas': 'us-ar',
  'california': 'us-ca',
  'colorado': 'us-co',
  'connecticut': 'us-ct',
  'delaware': 'us-de',
  'dist of columbia': 'us-dc',
  'florida': 'us-fl',
  'georgia': 'us-ga',
  'hawaii': 'us-hi',
  'idaho': 'us-id',
  'illinois': 'us-il',
  'indiana': 'us-in',
  'iowa': 'us-ia',
  'kansas': 'us-ks',
  'kentucky': 'us-ky',
  'louisiana': 'us-la',
  'maine': 'us-me',
  'maryland': 'us-md',
  'massachusetts': 'us-ma',
  'michigan': 'us-mi',
  'minnesota': 'us-mn',
  'mississippi': 'us-ms',
  'missouri': 'us-mo',
  'montana': 'us-mt',
  'nebraska': 'us-ne',
  'nevada': 'us-nv',
  'new hampshire': 'us-nh',
  'new jersey': 'us-nj',
  'new mexico': 'us-nm',
  'new york': 'us-ny',
  'north carolina': 'us-nc',
  'north dakota': 'us-nd',
  'ohio': 'us-oh',
  'oklahoma': 'us-ok',
  'oregon': 'us-or',
  'pennsylvania': 'us-pa',
  'rhode island': 'us-ri',
  'south carolina': 'us-sc',
  'south dakota': 'us-sd',
  'tennessee': 'us-tn',
  'texas': 'us-tx',
  'utah': 'us-ut',
  'vermont': 'us-vt',
  'virginia': 'us-va',
  'washington': 'us-wa',
  'west virginia': 'us-wv',
  'wisconsin': 'us-wi',
  'wyoming': 'us-wy',
  'alabama, us': 'us-al',
  'alaska, us': 'us-ak',
  'arizona, us': 'us-az',
  'arkansas, us': 'us-ar',
  'california, us': 'us-ca',
  'colorado, us': 'us-co',
  'connecticut, us': 'us-ct',
  'delaware, us': 'us-de',
  'florida, us': 'us-fl',
  'georgia, us': 'us-ga',
  'hawaii, us': 'us-hi',
  'idaho, us': 'us-id',
  'illinois, us': 'us-il',
  'indiana, us': 'us-in',
  'iowa, us': 'us-ia',
  'kansas, us': 'us-ks',
  'kentucky, us': 'us-ky',
  'louisiana, us': 'us-la',
  'maine, us': 'us-me',
  'maryland, us': 'us-md',
  'michigan, us': 'us-mi',
  'minnesota, us': 'us-mn',
  'mississippi, us': 'us-ms',
  'missouri, us': 'us-mo',
  'montana, us': 'us-mt',
  'nebraska, us': 'us-ne',
  'nevada, us': 'us-nv',
  'new hampshire, us': 'us-nh',
  'new jersey, us': 'us-nj',
  'new mexico, us': 'us-nm',
  'new york, us': 'us-ny',
  'north carolina, us': 'us-nc',
  'north dakota, us': 'us-nd',
  'ohio, us': 'us-oh',
  'oklahoma, us': 'us-ok',
  'oregon, us': 'us-or',
  'pennsylvania, us': 'us-pa',
  'rhode island, us': 'us-ri',
  'south carolina, us': 'us-sc',
  'south dakota, us': 'us-sd',
  'tennessee, us': 'us-tn',
  'texas, us': 'us-tx',
  'utah, us': 'us-ut',
  'vermont, us': 'us-vt',
  'virginia, us': 'us-va',
  'washington, us': 'us-wa',
  'west virginia, us': 'us-wv',
  'wisconsin, us': 'us-wi',
  'wyoming, us': 'us-wy'
}
