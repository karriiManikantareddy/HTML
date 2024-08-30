import { Injectable, Inject } from '@angular/core'
import { Observable } from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class CbsiDataService {
  abstract metadata(): Observable<Metadata>
  abstract totals(): Observable<any>
  abstract series(): Observable<any>
  abstract packagesSeries(): Observable<any>
  abstract lineItems(): Observable<LineItem[]>
  abstract packages(): Observable<Packages[]>
  abstract packageCreatives(): Observable<PackageCreatives[]>
  abstract creatives(): Observable<any>

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
    const params = <any>Object.fromQueryString(location.search)
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

  extremeDates(list: Packages[]) {
    let earliestDate, latestDate
    list.forEach(d => {
      const start = Number(Date.create(d.data.operative_start_date).format('{yyyy}{MM}{dd}'))
      const end = Number(Date.create(d.data.operative_end_date).format('{yyyy}{MM}{dd}'))
      if (earliestDate == undefined || earliestDate == 0) earliestDate = start
      if (start != 0 && earliestDate > start) earliestDate = start
      if (latestDate == undefined) latestDate = end
      if (end != 0 && latestDate < end) latestDate = end
    })
    return { earliestDate, latestDate }
  }

  dataCostTypes(costType, metrics, data): any {
    let deliveredBillRev = 0
    let bookedBillRev = 0
    switch (costType) {
      case 'CPM':
        if (metrics.billable_impressions > data.operative_quantity) {
          deliveredBillRev = (data.operative_quantity * data.operative_net_unit_cost) / 1000
        } else {
          deliveredBillRev = (metrics.billable_impressions * data.operative_net_unit_cost) / 1000
        }
        bookedBillRev = (data.operative_quantity * data.operative_net_unit_cost) / 1000
        break
    }
    return { deliveredBillRev, bookedBillRev }
  }

}

export class Metadata {
  public readonly campaignName: string
  public readonly operativeSalesOrderId: string
  public readonly startDate: string
  public readonly endDate: string
  public readonly netOrderCost: number

  constructor(
    public readonly advertiserName: string,
    public readonly campaign: any,
    public readonly operativeSalesOrder: any,
    readonly dates: Dates = null
  ) {
    this.campaignName = operativeSalesOrder.operative_sales_order
    this.netOrderCost = operativeSalesOrder.net_order_cost
    this.operativeSalesOrderId = campaign.operative_sales_order_id
    this.startDate = dates.startDate
    this.endDate = dates.endDate
  }
}

export class LineItem {
  constructor(
    public readonly metrics: any,
    public data
  ) {
  }
}

export class Creative {
  readonly metrics: any
  readonly creative: any
  readonly lineItem: any
  constructor(metrics, creative, lineItem) {
    this.metrics = metrics
    this.creative = creative
    this.lineItem = lineItem
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

  constructor(data, metrics, shareOfs) {
    this.name = data['platform_group']
    this.metrics = metrics
    this.shareOfs = shareOfs
  }
}

export class Region {
  readonly name: string
  readonly code: string
  readonly metrics: any

  constructor(data, metrics) {
    this.name = data['region']
    this.code = US_STATES_DEFINITIONS[this.name.toLowerCase()]
    this.metrics = metrics
  }
}

export class Country {
  readonly name: string
  readonly metrics: any

  constructor(data, metrics) {
    this.name = data['country']
    if(this.name in COUNTRIES_DEFINITIONS){
      this.name = COUNTRIES_DEFINITIONS[this.name]
    }
    this.metrics = metrics
  }
}

export class DayOfWeek {
  readonly name: string
  readonly index: number
  readonly metrics: any

  constructor(id, data, metrics) {
    this.name = data['day'] || id
    this.index = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].findIndex(this.name)
    this.metrics = metrics
  }
}

export class Hour {
  readonly hour: number
  readonly metrics: any

  constructor(data, metrics) {
    this.hour = data['hour'] != null ? parseInt(data['hour']) : -1
    this.metrics = metrics
  }
}

export class Packages {
  constructor(
    readonly name: string,
    readonly metrics: any,
    readonly data
  ) { }
}

export class PackageCreatives {
  constructor(
    readonly name: any,
    readonly creatives: any
  ) { }
}

export class PackagesByDay {
  readonly name: string
  readonly metrics
  readonly data
  constructor(name: string, metrics, data) {
    this.name = name
    this.metrics = metrics
    this.data = data
  }
}

export class Placements {
  constructor(
    readonly name: string,
    readonly metrics: any,
    readonly data
  ) { }
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

// The country names in DFP do not always match the names HighMaps use, therefor this translation is done
const COUNTRIES_DEFINITIONS = {
  'United States' : 'United States of America'
}
