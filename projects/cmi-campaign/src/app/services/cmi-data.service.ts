import {Observable} from 'rxjs'

export interface Dates {
  startDate?: string
  endDate?: string
}

export abstract class CmiDataService {
  abstract dfpCampaign(): Observable<any>
  abstract dfpCreative(): Observable<any>
  abstract audienceExtensionVideoCampaign(): Observable<any>
  abstract audienceExtensionVideoCreative(): Observable<any>
  abstract tveCampaign(): Observable<any>
  abstract tveCreative(): Observable<any>
  abstract tveDeviceName(): Observable<any>
  abstract tveDaypart(): Observable<any>
  abstract videoTotal(): Observable<any>
  abstract mappedTveTubemogulSite(): Observable<any>
  abstract mappedGoogleCampaignManagerCreative(): Observable<any>
  abstract mappedVideoSimplifiTargetGeo(): Observable<any>
  abstract mappedVideoSimplifiTargetKeyword(): Observable<any>
  abstract audienceExtensionDisplayCampaign(): Observable<any>
  abstract audienceExtensionDisplayCreative(): Observable<any>
  abstract mappedDisplaySimplifiTargetGeo(): Observable<any>
  abstract mappedDisplaySimplifiTargetKeyword(): Observable<any>
  abstract mappedDisplaySimplifiCreative(): Observable<any>
  abstract displayTotal(): Observable<any>
  abstract googleAdsCampaign(): Observable<any>
  abstract googleAdsAd(): Observable<any>
  abstract googleAdsKeyword(): Observable<any>
  abstract googleAdsDevice(): Observable<any>
  abstract autoDynamicCampaign(): Observable<any>
  abstract autoDynamicCampaignAttribution(): Observable<any>
  abstract autoDynamicCampaignNewOrUsed(): Observable<any>
  abstract autoDynamicCampaignTotal(): Observable<any>
  abstract socialCampaign(): Observable<any>
  abstract socialPublisherPlatform(): Observable<any>
  abstract socialAd(): Observable<any>
  abstract socialTotal(): Observable<any>
  abstract mappedAudioAdvertisersCampaign(): Observable<any>
  abstract mappedAudioAdvertisersCreative(): Observable<any>
  abstract hasAEV(): Observable<boolean>
  abstract hasAED(): Observable<boolean>
  abstract hasTVE(): Observable<boolean>
  abstract hasSearch(): Observable<boolean>
  abstract hasDFP(): Observable<boolean>
  abstract hasAutoDynamic(): Observable<boolean>
  abstract hasSocial(): Observable<boolean>
  abstract hasAudio(): Observable<boolean>
  abstract freewheelSites(): Observable<any>
  abstract simplifiSites(): Observable<any>
  abstract gcmSites(): Observable<any>
  abstract tveSites(): Observable<any>

  dates: Dates

  constructor() {
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
