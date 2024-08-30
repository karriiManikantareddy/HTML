import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class TheAdvocateDataService {
  abstract metadata(): Observable<Metadata | undefined>
  abstract totals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract totalsByDay(): Observable<any>
  abstract hasOnsiteDisplay(): Observable<boolean>
  abstract onsiteDisplayTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract onsiteDisplayTotalsByDay(): Observable<any>
  abstract onsiteDisplayBreakdownItems(): Observable<Item[]>
  abstract onsiteDisplayLineItemBreakdownItems(): Observable<Item[]>
  abstract onsiteDisplayMetroBreakdownItems(): Observable<Item[]>
  abstract hasOnsiteVideo(): Observable<boolean>
  abstract onsiteVideoTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract onsiteVideoTotalsByDay(): Observable<any>
  abstract onsiteVideoBreakdownItems(): Observable<Item[]>
  abstract onsiteVideoMetroBreakdownItems(): Observable<Item[]>
  abstract hasNewsletters(): Observable<boolean>
  abstract newslettersTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract newslettersTotalsByDay(): Observable<any>
  abstract newslettersBreakdownItems(): Observable<Item[]>
  abstract newslettersLineItemBreakdownItems(): Observable<Item[]>
  abstract newslettersMetroBreakdownItems(): Observable<Item[]>
  abstract hasGoogleSearch(): Observable<boolean>
  abstract googleSearchTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract googleSearchTotalsByDay(): Observable<any>
  abstract googleSearchBreakdownItems(): Observable<Item[]>
  abstract hasFacebook(): Observable<boolean>
  abstract facebookTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract facebookTotalsByDay(): Observable<any>
  abstract facebookBreakdownItems(): Observable<Item[]>
  abstract facebookCampaignBreakdownItems(): Observable<Item[]>
  abstract facebookAdSetBreakdownItems(): Observable<Item[]>
  abstract hasSiteImpact(): Observable<boolean>
  abstract siteImpactTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract siteImpactTotalsByDay(): Observable<any>
  abstract siteImpactBreakdownItems(): Observable<Item[]>
  abstract siteImpactDeviceBreakdownItems(): Observable<Item[]>
  abstract hasStreamingTv(): Observable<boolean>
  abstract streamingTvTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract streamingTvTotalsByDay(): Observable<any>
  abstract streamingTvBreakdownItems(): Observable<Item[]>
  abstract streamingTvLineItemBreakdownItems(): Observable<Item[]>
  abstract streamingTvAppBreakdownItems(): Observable<Item[]>
  abstract streamingTvGeoBreakdownItems(): Observable<Item[]>
  abstract hasStreamingRadio(): Observable<boolean>
  abstract streamingRadioTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract streamingRadioTotalsByDay(): Observable<any>
  abstract streamingRadioBreakdownItems(): Observable<Item[]>
  abstract streamingRadioLineItemBreakdownItems(): Observable<Item[]>
  abstract streamingRadioAppBreakdownItems(): Observable<Item[]>
  abstract hasYoutube(): Observable<boolean>
  abstract youtubeTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract youtubeTotalsByDay(): Observable<any>
  abstract youtubeBreakdownItems(): Observable<Item[]>
  abstract hasExtendedNetworkDisplay(): Observable<boolean>
  abstract extendedNetworkDisplayTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract extendedNetworkDisplayTotalsByDay(): Observable<any>
  abstract extendedNetworkDisplayBreakdownItems(): Observable<Item[]>
  abstract extendedNetworkDisplayLineItemBreakdownItems(): Observable<Item[]>
  abstract hasPrerollVideo(): Observable<boolean>
  abstract prerollVideoTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract prerollVideoTotalsByDay(): Observable<any>
  abstract prerollVideoBreakdownItems(): Observable<Item[]>
  abstract prerollVideoAppBreakdownItems(): Observable<Item[]>
  abstract hasGoogleAnalytics(): Observable<boolean>
  abstract googleAnalyticsTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract googleAnalyticsTotalsByDay(): Observable<any>
  abstract googleAnalyticsChannelBreakdownItems(): Observable<Item[]>
  abstract hasBrandedContent(): Observable<boolean>
  abstract brandedContentTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>
  abstract brandedContentTotalsByDay(): Observable<any>
  abstract brandedContentArticleBreakdownItems(): Observable<Item[]>
  abstract hasSemKeywords(): Observable<boolean>;
  abstract semKeywordreakdown(): Observable<Item[]>;
  abstract hasAmazonVideo(): Observable<boolean>;
  abstract amazonVideoTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract amazonVideoTotalsByDay(): Observable<any>;
  abstract amazonVideoBreakdownItems(): Observable<Item[]>;
  abstract amazonVideoLineItemBreakdownItems(): Observable<Item[]>;
  abstract hasAmazonDisplay(): Observable<boolean>;
  abstract amazonDisplayTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract amazonDisplayTotalsByDay(): Observable<any>;
  abstract amazonDisplayBreakdownItems(): Observable<Item[]>;
  abstract amazonDisplayLineItemBreakdownItems(): Observable<Item[]>;
  abstract hasSocial(): Observable<boolean>;
  abstract socialTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract socialByDay(): Observable<any>;
  abstract hasProgrammaticVideo(): Observable<boolean>;
  abstract programmaticVideoTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract programmaticVideoTotalsByDay(): Observable<any>;
  abstract programmaticVideoBreakdownItems(): Observable<Item[]>;
  abstract programmaticVideoLineItemBreakdownItems(): Observable<Item[]>;
  abstract tiktokDisplayTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract tiktokDisplayTotalsByDay(): Observable<any>;
  abstract googleAdsCitiesBreakdownItems(): Observable<Item[]>;
  abstract hasTikTok(): Observable<boolean>;
  abstract hasGoogleAds(): Observable<boolean>;
  abstract extendedNetworkMetroBreakdownItems(): Observable<Item[]>;
  abstract tiktokDisplayLineItemBreakdownItems(): Observable<Item[]>;
  abstract tiktokBreakdownItems(): Observable<Item[]>;  
  abstract hasGeoFencing(): Observable<boolean>
  abstract geoFencingOverview(): Observable<any>
  abstract geoFencingByDay(): Observable<any>
  abstract geoFencingCampaigns(): Observable<Item[]>
  abstract geoFencingCreatives(): Observable<Item[]>
  abstract geoFencingCity();
  abstract onsiteDisplayCleanName(): Observable<Item[]>;
  abstract newslettersCleanName(): Observable<Item[]>;
  abstract hasLinkedIn(): Observable<boolean>;
  abstract linkedInTotals(): Observable<Partial<Readonly<Record<string, MetricValue>>>>;
  abstract linkedInTotalsByDay(): Observable<any>;
  abstract linkedInCampaignBreakdownItems(): Observable<Item[]>;
  abstract linkedInCreative(): Observable<Item[]>;
  abstract linkedInCitiesBreakdownItems(): Observable<Item[]>;
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
  readonly name?: string

  constructor(
    public readonly advertiser?: string,
    readonly dates?: Dates,
    public readonly advertiserData?: any
  ) {
    this.name = advertiser
    this.startDate = dates && dates.startDate
    this.endDate = dates && dates.endDate
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

export class Metro {
  public readonly searchAd: SearchAd
  public readonly displayAd: DisplayAd
  public readonly name?: string

  constructor(
    _name?: string,
    public readonly parent?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>, 
  ) {
    const state: string = _name.slice(_name.length - 2, _name.length)
    this.name = _name.slice(0, _name.length - 3).trim() + ', ' + state
  }
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
export class City {
  public readonly searchAd: SearchAd;
  public readonly displayAd: DisplayAd;
  public readonly name?: string;

  constructor(
    _name?: string,
    public readonly parent?: string,
    public readonly metrics?: Partial<Readonly<Record<string, MetricValue>>>, 
  ) {
    this.name = _name;
  }
}
