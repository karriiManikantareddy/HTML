import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class EwScrippsDataService {
  abstract metadata(): Observable<Metadata | undefined>
  abstract attributionTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract totals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract totalsByDay(): Observable<any>
  abstract hasCallrail(): Observable<boolean>
  abstract callrailTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract callrailTotalsByDay(): Observable<any>
  abstract callrailBreakdownItems(): Observable<Item[]>
  abstract hasGam(): Observable<boolean>
  abstract gamTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract gamTotalsByDay(): Observable<any>
  abstract gamLineItemBreakdownItems(): Observable<Item[]>
  abstract gamBreakdownItems(): Observable<Item[]>
  abstract hasGdn(): Observable<boolean>
  abstract gdnTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract gdnTotalsByDay(): Observable<any>
  abstract gdnBreakdownItems(): Observable<Item[]>
  abstract gdnAdGroupBreakdownItems(): Observable<Item[]>
  abstract hasGoogleSearch(): Observable<boolean>
  abstract googleSearchTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract googleSearchTotalsByDay(): Observable<any>
  abstract googleSearchBreakdownItems(): Observable<Item[]>
  abstract googleSearchAdGroupBreakdownItems(): Observable<Item[]>
  abstract hasGooglePerformanceMax(): Observable<boolean>
  abstract googlePerformanceMaxTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract googlePerformanceMaxTotalsByDay(): Observable<any>
  abstract googlePerformanceMaxBreakdownItems(): Observable<Item[]>
  abstract hasGroundtruth(): Observable<boolean>
  abstract groundtruthTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract groundtruthTotalsByDay(): Observable<any>
  abstract groundtruthAdgroupBreakdownItems(): Observable<Item[]>
  abstract groundtruthZipBreakdownItems(): Observable<Item[]>
  abstract groundtruthBreakdownItems(): Observable<Item[]>
  abstract hasFacebook(): Observable<boolean>
  abstract facebookTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract facebookTotalsByDay(): Observable<any>
  abstract facebookBreakdownItems(): Observable<Item[]>
  abstract facebookAdSetBreakdownItems(): Observable<Item[]>
  abstract hasMadhive(): Observable<boolean>
  abstract madhiveTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract madhiveTotalsByDay(): Observable<any>
  abstract madhiveBreakdownItems(): Observable<Item[]>
  abstract madhivePublisherBreakdownItems(): Observable<Item[]>
  abstract hasSimplifi(): Observable<boolean>
  abstract simplifiTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract simplifiTotalsByDay(): Observable<any>
  abstract simplifiCampaignBreakdownItems(): Observable<Item[]>
  abstract simplifiBreakdownItems(): Observable<Item[]>
  abstract hasSiteImpact(): Observable<boolean>
  abstract siteImpactTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract siteImpactTotalsByDay(): Observable<any>
  abstract siteImpactBreakdownItems(): Observable<Item[]>
  abstract hasYoutube(): Observable<boolean>
  abstract youtubeTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract youtubeTotalsByDay(): Observable<any>
  abstract youtubeBreakdownItems(): Observable<Item[]>

  dates: Dates

  constructor(private window: any) {
    this.dates = this.datesFromInterval(location)
  }

  updateDates(startDate?: string, endDate?: string) {
    if (this.dates.startDate == null || startDate && startDate > this.dates.startDate) {
      this.dates.startDate = startDate
    }

    if (this.dates.endDate == null || endDate && endDate < this.dates.endDate) {
      this.dates.endDate = endDate
    }
  }

  private datesFromInterval(location: Location): Dates {
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
  readonly startDate?: string
  readonly endDate?: string
  readonly station?: string
  readonly name?: string
  readonly salesRep?: string

  constructor(
    public readonly advertiser?: string,
    readonly dates?: Dates,
    public readonly advertiserData?: any
  ) {
    const split = advertiser.split('.')
    this.name = split[1]
    this.startDate = dates && dates.startDate
    this.endDate = dates && dates.endDate
    this.station = split[0]
    this.salesRep = advertiserData['sales_rep']
  }
}

export interface ChartConfig {
  barMetric: string
  splines: string[]
}

export interface SearchAd {
  headline1: string
  headline2: string
  url: string
  description: string
}

export interface DisplayAd {
  image: string,
  width: number,
  height: number,
}

export class Item {
  public readonly searchAd: SearchAd
  public readonly displayAd: DisplayAd

  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>, 
    public readonly data?: any,
    public readonly product?: string,
    public readonly parent?: string,
  ) {
    if (this.product === 'google_search') {
      this.searchAd = {
        headline1: this.data['headline_1'],
        headline2: this.data['headline_2'],
        url: this.data['final_url'],
        description: this.data['description'],
      }
    } else if (this.product === 'gam') {
      this.displayAd = {
        image: this.data['preview_url'],
        width: this.data['width'],
        height: this.data['height'],
      }
    } else if (this.product === 'google_display') {
      this.displayAd = {
        image: this.data['image_ad_url'],
        height: this.data['image_height'],
        width: this.data['image_width'],
      }
    } else if (this.product === 'facebook') {
      this.displayAd = {
        image: this.data['thumbnail_url'],
        height: 50,
        width: 50,
      } 
    } else if (this.product === 'simplifi') {
      this.displayAd = {
        image: this.data['primary_creative_url'],
        height: 50,
        width: 50,
      } 
    } else if (this.product === 'groundtruth') {
      this.displayAd = {
        image: this.data['url'],
        height: 50,
        width: 50,
      } 
    }
  }
}
