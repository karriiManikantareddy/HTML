export class Metadata {
  readonly name: string
  readonly startDate: string
  readonly endDate: string

  constructor(data: any) {
    this.name = data['order']
    this.startDate = data['start_date_yyyymmdd']
    this.endDate = data['end_date_yyyymmdd'].length ? data['end_date_yyyymmdd'] : Date.create('yesterday')
  }
}

export class LineItem {
  readonly name: string
  readonly metrics: Partial<Record<string, number>>

  constructor(data: any, metrics: any) {
    this.name = data['line_item']
    this.metrics = metrics
  }
}

export class Creative {
  readonly name: string
  readonly assetUrl: string
  readonly previewUrl: string
  readonly width: number
  readonly height: number

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data['creative']
    this.assetUrl = data['asset_url']
    this.previewUrl = data['preview_url']
    this.width = data['width']
    this.height = data['height']
  }
}

export class CreativeSize {
  readonly name: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>, readonly shareOfs: Partial<Record<string, number>>) {
    this.name = data['creative_size']
  }
}

export class Platform {
  readonly name: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>, readonly shareOfs: Partial<Record<string, number>>) {
    this.name = data['device_category']
  }
}

export class Region {
  readonly name: string
  readonly code: string

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data['region']
    this.code = US_STATES_DEFINITIONS[this.name.toLowerCase()] || '??'
    this.metrics = metrics
  }
}

export class DayOfWeek {
  readonly name: string
  readonly index: number

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.name = data['day']
    this.index = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].findIndex(this.name)
    this.metrics = metrics
  }
}

export class Hour {
  readonly hour: number

  constructor(data: any, readonly metrics: Partial<Record<string, number>>) {
    this.hour = data['hour'] != null ? parseInt(data['hour']) : -1
    this.metrics = metrics
  }
}

export const US_STATES_DEFINITIONS: Partial<Record<string, string>> = {
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
