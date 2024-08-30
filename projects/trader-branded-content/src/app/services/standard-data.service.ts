import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}
export abstract class StandardDataService {
  abstract dfpTotals(): Observable<any>
  abstract dfpSeries(): Observable<any>
  abstract dfpCreatives(): Observable<DfpCreative[]>
  abstract dfpPlatforms(): Observable<DfpPlatform[]>
  abstract dfpContentAction(): Observable<DfpContentAction[]>
  abstract fbTotals(): Observable<any>
  abstract fbSeries(): Observable<any>
  abstract gaAdvertiser(): Observable<GaAdvertiser>

  constructor(private window: any) {}
}

export class DfpCreative {
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
    this.width = data['width']
    this.height = data['height']
    this.metrics = metrics
  }
}

export class DfpPlatform {
  readonly name: string
  readonly metrics: any
  readonly shareOfs: any

  constructor(data, metrics, shareOfs, dimension) {
    this.name = data[dimension]
    this.metrics = metrics
    this.shareOfs = shareOfs
  }
}

export class DfpContentAction {
  constructor(public readonly data, public readonly metrics) {}
}

export class GaAdvertiser {
  constructor(public readonly data, public readonly metrics) {}
}
