import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class CumulusMediaDataService {
  abstract metadata(): Observable<Metadata | undefined>
  abstract socialTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract socialAdvertiserByWeek(): Observable<any>
  abstract socialCampaigns(): Observable<SocialCampaign[]>
  abstract socialAds(): Observable<SocialAd[]>
  abstract socialPlatforms(): Observable<SocialPlatform[]>
  abstract websiteTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract websiteByWeek(): Observable<any>
  abstract websiteGenders(): Observable<WebsiteGender[]>
  abstract websiteDevices(): Observable<WebsiteDevice[]>
  abstract websiteAges(): Observable<WebsiteAge[]>
  abstract gamTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract gamAdvertiserByWeek(): Observable<any>
  abstract gamAds(): Observable<GamAd[]>
  abstract centroTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract centroAdvertiserByWeek(): Observable<any>
  abstract centroAds(): Observable<CentroAd[]>


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

  constructor(
    public readonly name?: string,
    readonly dates?: Dates,
    public readonly advertiser?: string
  ) {
    this.name = name
    this.startDate = dates && dates.startDate
    this.endDate = dates && dates.endDate
    this.advertiser = advertiser
  }
}

export class SocialCampaign {
  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}

export class SocialPlatform {
  readonly prettyName?: string

  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
    this.prettyName = name.titleize()
  }
}

export class SocialAd {
  readonly name?: string
  readonly thumbnailUrl?: string

  constructor(
    public readonly data?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
    this.name = data.ad
    this.thumbnailUrl = data.thumbnail_url
  }
}

export class WebsiteGender {
  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}

export class WebsiteDevice {
  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}

export class WebsiteAge {
  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}
export class GamAd {
  readonly name?: string
  readonly thumbnailUrl?: string

  constructor(
    public readonly data?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
    this.name = data.creative
    this.thumbnailUrl = data.asset_url
  }
}

export class CentroAd {
  readonly name?: string

  constructor(
    public readonly data?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
    this.name = data.creative
  }
}
