import {Injectable, Inject} from '@angular/core'
import {Observable} from 'rxjs'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model';

export interface Dates {
  startDate?: string
  endDate?: string
}

export function safeDiv(a: number|null|undefined, b: number|null|undefined): number|undefined {
  if (b && (a || a === 0)) {
    return a / b
  }
}

export abstract class NytDataService {
  abstract metadata(): Observable<Metadata | undefined>
  abstract totals(): Observable<Partial<Readonly<Record<string, number>>>>
  abstract nativeTotals(): Observable<Partial<Readonly<Record<string, number>>>>
  abstract series(): Observable<ChartSeries[]>
  abstract nativeSeries(): Observable<ChartSeries[]>
  abstract lineItems(): Observable<LineItem[]>
  abstract nativeLineItems(): Observable<LineItem[]>
  abstract creatives(): Observable<DfpCreative[]>
  abstract nativeCreatives(): Observable<Creative[]>
  abstract platforms(): Observable<Platform[]>
  abstract regions(): Observable<Region[]>
  abstract regions_by_country(): Observable<{}>
  abstract countries(): Observable<Country[]>
  abstract sections(): Observable<Section[]>
  abstract subsections(): Observable<Subsection[]>
  abstract paidPosts(): Observable<PaidPost[]>
  abstract nonDFPLineItems(): Observable<LineItem[]>
  abstract nativeNonDFPLineItems(): Observable<LineItem[]>
  abstract benchmarks(): Observable<Benchmark[]>
  abstract benchmarksFiltered(): Observable<Benchmark>;

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

export class LineItem {
  readonly name?: string
  readonly startDate?: string
  readonly endDate?: string
  readonly bookedImpressions?: number
  readonly costType?: string
  readonly budget?: number
  readonly revenueType: string

  private REVENUE_FILTERS = ['Added Value', 'Make Good']

  constructor(readonly id: string, data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data.line_item
    this.metrics = metrics
    this.startDate = data.li_start_date
    this.endDate = data.li_end_date
    this.revenueType = data.revenue_type
    if (this.REVENUE_FILTERS.indexOf(this.revenueType) > -1) {
      this.budget = 0
    } else {
      this.budget = data.contracted_revenue
    }
    this.bookedImpressions = data.contracted_volume
    this.costType = data.price_type
  }
}

export class LandingPage {
  readonly name?: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data.ga_landing_page
    this.metrics = metrics
  }
}

export class PaidPost {
  readonly id?: string
  readonly name?: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data.ga_paid_post_parameter
    this.metrics = metrics
    if (this.name) {
      this.id = this.name.parameterize()
    }
  }
}

export interface Creative {
  readonly name?: string
  readonly metrics: any
  readonly lineItemName?: string
}

export class DfpCreative implements Creative {
  readonly name?: string
  readonly assetUrl?: string
  readonly previewUrl?: string
  readonly width?: number
  readonly height?: number
  readonly lineItemName?: string
  readonly revenueType?: string
  readonly costType?: string

  constructor(readonly id: string, data: any, readonly metrics: Partial<Record<string, number>>, lineItemData?: any) {
    this.name = data.creative
    this.assetUrl = data.asset_url
    this.previewUrl = data.preview_url
    this.width = data.width
    this.height = data.height
    if (lineItemData) {
      this.lineItemName = lineItemData.line_item
      this.revenueType = lineItemData && lineItemData.revenue_type
      this.costType = lineItemData.cost_type
    }
  }
}

export class FbCreative implements Creative {
  readonly name?: string
  readonly lineItemName?: string
  readonly revenueType?: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>, lineItemData?: any) {
    this.name = data.fb_ad
    if (lineItemData) {
      this.lineItemName = lineItemData.line_item
      this.revenueType = lineItemData && lineItemData.revenue_type
    }
  }
}

export class Platform {
  readonly name?: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>, readonly shareOfs: Partial<Record<string, number>>) {
    this.name = data.dfp_device_category
  }
}

export class Region {
  readonly name?: string
  readonly code: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data.dfp_region
    this.code = US_STATES_DEFINITIONS[(this.name || '').toLowerCase()] || '??'
  }
}

export class Country {
  readonly name: string
  readonly metrics: any

  constructor(data, metrics) {
    this.name = data['dfp_country']
    this.name = COUNTRIES_DEFINITIONS[this.name] || this.name
    this.metrics = metrics
  }
}

export class Section {
  readonly name: string
  readonly metrics: any

  constructor(data, metrics) {
    this.name = data.dfp_ad_unit_2
    this.metrics = metrics
  }
}

export class Subsection {
  readonly name: string
  readonly metrics: any

  constructor(data, metrics) {
    this.name = data.dfp_ad_unit_3
    this.metrics = metrics
  }
}

export class Benchmark {
  readonly benchmark_ad_type_ctr: any[]
  readonly benchmark_ad_type_vcr: any[]
  readonly benchmark_device_ctr: any[]
  readonly benchmark_device_vcr: any[]
  readonly benchmark_section_ctr: any[]
  readonly benchmark_section_vcr: any[]
  readonly benchmark_subsection_ctr: any[]
  readonly benchmark_subsection_vcr: any[]
  readonly benchmark_motivation_ctr: any[]
  readonly benchmark_motivation_industry_ctr: any[]
  readonly benchmark_emotion_ctr: any[]
  readonly benchmark_emotion_industry_ctr: any[]
  readonly startDate: Date
  readonly endDate: Date
  readonly campaignName: string

  constructor(benchmarkData: any, campaign: any) {
    this.benchmark_ad_type_ctr = (JSON.parse(benchmarkData['benchmark_ad_type_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_ad_type_vcr = (JSON.parse(benchmarkData['benchmark_ad_type_vcr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_device_ctr = (JSON.parse(benchmarkData['benchmark_device_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_device_vcr = (JSON.parse(benchmarkData['benchmark_device_vcr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_section_ctr = (JSON.parse(benchmarkData['benchmark_section_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_section_vcr = (JSON.parse(benchmarkData['benchmark_section_vcr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_subsection_ctr = (JSON.parse(benchmarkData['benchmark_subsection_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_subsection_vcr = (JSON.parse(benchmarkData['benchmark_subsection_vcr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_subsection_vcr = (JSON.parse(benchmarkData['benchmark_subsection_vcr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_motivation_ctr = (JSON.parse(benchmarkData['benchmark_motivation_name_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_motivation_industry_ctr = (JSON.parse(benchmarkData['benchmark_motivation_name_industry_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_emotion_ctr = (JSON.parse(benchmarkData['benchmark_emotion_ind_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.benchmark_emotion_industry_ctr = (JSON.parse(benchmarkData['benchmark_emotion_ind_industry_ctr']) || []).map((b: any) => ({name: b.slice, y: b.value}))
    this.startDate = Date.create(benchmarkData['min_start'])
    this.endDate = Date.create(benchmarkData['max_end'])
    this.campaignName = campaign.campaign
    this.benchmark_subsection_ctr = this.benchmark_subsection_ctr.filter(b => b.name.toLowerCase() !== 'ios')
    this.benchmark_subsection_vcr = this.benchmark_subsection_vcr.filter(b => b.name.toLowerCase() !== 'ios')
  }
}

const US_STATES_DEFINITIONS: Partial<Record<string, string>> = {
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

const COUNTRIES_DEFINITIONS = {
  'United States' : 'United States of America'
}
