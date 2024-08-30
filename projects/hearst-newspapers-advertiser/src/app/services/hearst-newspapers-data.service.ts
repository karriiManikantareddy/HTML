import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class HearstNewspapersDataService {
  abstract metadata(): Observable<Metadata | undefined>
  abstract hasSocial(): Observable<boolean>
  abstract socialTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract socialAdvertiserByWeek(): Observable<any>
  abstract socialCampaigns(): Observable<SocialCampaign[]>
  abstract socialAds(): Observable<Ad[]>
  abstract socialPlatforms(): Observable<Platform[]>
  abstract hasSem(): Observable<boolean>
  abstract semTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract semByWeek(): Observable<any>
  abstract semCampaigns(): Observable<SemCampaign[]>
  abstract hasDisplay(): Observable<boolean>
  abstract displayTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract displayWeeklyTotals(): Observable<any>
  abstract displayAds(): Observable<Ad[]>
  abstract displayPlatforms(): Observable<Platform[]>
  abstract hasEmail(): Observable<boolean>
  abstract emailTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract emailWeeklyTotals(): Observable<any>
  abstract emailAds(): Observable<EmailAd[]>
  abstract emailLinks(): Observable<Link[]>
  abstract hasNewsletter(): Observable<boolean>
  abstract newsletterTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract newsletterWeeklyTotals(): Observable<any>
  abstract hasSeo(): Observable<boolean>
  abstract seoTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract seoMonthlyTotals(): Observable<any>
  abstract hasLocalEdgeWeb(): Observable<boolean>
  abstract localEdgeWebTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract localEdgeWebWeeklyTotals(): Observable<any>

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
  readonly cxuName?: string
  readonly cxuEmail?: string

  constructor(
    public readonly name?: string,
    readonly dates?: Dates,
    public readonly advertiser?: any,
    public readonly market?: string
  ) {
    this.name = name
    this.startDate = dates && dates.startDate
    this.endDate = dates && dates.endDate
    this.advertiser = advertiser
    this.cxuName = advertiser.customer_experience_user_name
    this.cxuEmail = advertiser.customer_experience_user_email
  }
}

export class SocialCampaign {
  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}

export class Platform {
  readonly prettyName?: string

  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
    this.prettyName = name.titleize()
  }
}

export class Ad {
  readonly name?: string
  readonly adImage?: string

  constructor(
    public readonly data?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
    this.name = data.ad || data.creative || data.campaign
    this.adImage = data.ad_image || data.image
  }
}

export class EmailAd {

  constructor(
    public readonly name?: any,
    public readonly subject?: any,
    public readonly from?: any,
    public readonly screenshot?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
  }
}

export class NewsletterAd {

  constructor(
    public readonly name?: any,
    public readonly screenshot?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {
  }
}

export class Link {

  constructor(
    public readonly name?: any,
    public readonly campaign?: any,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}

export class SemCampaign {
  constructor(
    public readonly name?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>
  ) {}
}
