import { ChartSeries } from 'projects/template-module/src/lib/services/result.model'
import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class NprDataService {
  abstract cfrCampaign(): Observable<Metadata>
  abstract totals(): Observable<Number>
  abstract creativeSeries(): Observable<ChartSeries[]>
  abstract creatives(): Observable<Creative[]>
  abstract products(): Observable<Product[]>
  abstract platforms(): Observable<Platform[]>
  abstract regions(): Observable<Region[]>
  abstract productsByAge(): Observable<Benchmark[]>

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
    } 
    else {
      const parts = interval.toString().split('-')
      return {
        startDate: parts[0],
        endDate: parts[1],
      }
    }
  }
}

export class Metadata {
  public readonly name: string
  public readonly account: string
  public readonly startDate: string
  public readonly endDate: string
  public readonly deal: string
  public readonly source: string

  constructor(name, account, dates, deal, source) {
    this.name = name
    this.account = account
    this.startDate = dates.startDate
    this.endDate = dates.endDate
    this.deal = deal
    this.source = source
  }
}

export class Creative {
  readonly name: string

  constructor(id) {
    this.name = id
  }
}

export class Product {
  readonly name: string
  readonly metrics: any
  readonly shareOfs: any

  constructor(data, metrics, shareOfs) {
    this.name = data['podcast_show']
    this.metrics = metrics
    this.shareOfs = shareOfs
  }
}

export class Platform {
  readonly name: string
  readonly metrics: any
  readonly url: string

  constructor(data, metrics) {
    this.metrics = metrics

    switch (data) {
      case "DESKTOP_AND_LAPTOPS":  
        this.name = "Desktop"
        this.url = this.iconUrl(data)
          break;
      case "DIGITAL_APPLIANCES":
        this.name = "Connected TV"
        this.url = this.iconUrl(data)
        break;
      case "MOBILE_AND_TABLETS":  
        this.name = "Tablet & Mobile" 
        this.url = this.iconUrl(data)
        break;
      case "SMART_SPEAKERS":  
        this.name = "Smart Speakers" 
        this.url = this.iconUrl(data)
        break;
      default:
        break;
    }
  }

  iconUrl(name: string) {
    return `assets/img/${name}.png`
  }
}

export class Region {
  readonly name: string
  readonly metrics: any

  constructor(id, metrics) {
    this.name = id
    this.metrics = metrics
  }
}

export class Benchmark {
  readonly podcastShow: string
  readonly metrics: any
  readonly age: any
  readonly source: string

  constructor(id, data, metrics, age) {
    this.podcastShow = data['podcast_show'] || id
    this.metrics = metrics
    this.age = age.replace(/ *\([^)]*\) */g, "")
  }
}