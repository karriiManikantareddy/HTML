import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class FundaDataService {
  abstract dfpCampaign(): Observable<any>
  abstract dfpTotals(): Observable<any>
  abstract dfpSeries(): Observable<any>
  abstract dfpLineItems(): Observable<any>
  abstract dfpCreatives(): Observable<any>
  abstract dfpPlatforms(): Observable<any>
  abstract dfpDomains(): Observable<any>
  abstract dfpRegions(): Observable<any>
  abstract dfpSalesPerson(): Observable<any>
  abstract gaArticles(): Observable<any>
  abstract dfpDevice(): Observable<any>

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
    public readonly advertiser: string,
    readonly dates: Dates = null,
    public totalAmount: number = null,
    public salesOrder: any = {},
  ) {
    this.startDate = dates.startDate
    this.endDate = dates.endDate
  }
}

export class LineItem {
  public readonly pacing: number

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly metrics: any,
    readonly bookedImpressions: number,
  ) {
    this.pacing = bookedImpressions
      ? (metrics.dfp_total_line_item_level_impressions || 0) / bookedImpressions
      : null
  }
}

export class Article {
  constructor(
    public readonly pagePath: string,
    public readonly metrics: any,
    public readonly outboundLinkClicks: number
  ) {}
}

export class OutboundLink {
  constructor(
    public readonly outboundLink: string,
    public readonly pagePath: string,
    public readonly metrics: any
  ) {}
}

export class Creative {
  readonly name: string
  readonly assetUrl: string
  readonly previewUrl: string
  readonly width: number
  readonly height: number
  readonly metrics: any
  readonly size: string

  constructor(id, data, metrics, size) {
    const sizes = size['dfp_creative_size'].split(/x/i).map(size => size.trim())
    this.name = data['creative'] || id
    this.assetUrl = data['asset_url']
    this.previewUrl = data['preview_url']
    this.width = data['width'] || Number(sizes[0])
    this.height = data['height'] || Number(sizes[1])
    this.metrics = metrics
    this.size = size['dfp_creative_size']
  }
}

export class Platform {
  constructor(
    readonly name: string,
    readonly metrics: any,
    readonly shareOfs: any
  ) {}
}

export class Domain {
  constructor(
    readonly name: string,
    readonly metrics: any,
    readonly shareOfs: any
  ) {}
}

export class Region {
  readonly name: string
  readonly code: string
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['dfp_region'] && data['dfp_region'].toLowerCase() || id
    this.code = NL_REGION_DEFINITIONS[this.name.toLowerCase()]
    this.metrics = metrics
  }
}

export class SalesPerson {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly mobilePhone: string,
  ) {}
}

const NL_REGION_DEFINITIONS = {
  'drenthe': 'nl-dr',
  'flevoland': 'nl-fl',
  'friesland': 'nl-fr',
  'gelderland': 'nl-ge',
  'groningen': 'nl-gr',
  'limburg': 'nl-li',
  'north brabant': 'nl-nb',
  'north holland': 'nl-nh',
  'overijssel': 'nl-ov',
  'south holland': 'nl-zh',
  'utrecht': 'nl-ut',
  'zeeland': 'nl-ze',
}

const PLATFORM_DEFINITIONS = {
  app: {
    mobile: 'Mobile app',
    tablet: 'App/Tablet'
  },
  web: {
    desktop: 'Mobile web',
    mobile: 'Desktop',
    tablet: 'Web/Tablet'
  }
}

export class Device {
  constructor(
    readonly name: string,
    readonly metrics: any,
    readonly shareOfs: any
  ) {}
}