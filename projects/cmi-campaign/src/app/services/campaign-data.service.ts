import {forkJoin, of, Subject, combineLatest} from 'rxjs'
import {catchError, mergeMap} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {CmiDataService} from './cmi-data.service'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model'
export * from './cmi-data.service'

@Injectable()
export class CampaignDataService extends CmiDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    // @ts-ignore
    super(window)
  }

  hasAEV() {
    const subject = new Subject<boolean>()
    this.audienceExtensionVideoCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  hasAED() {
    const subject = new Subject<boolean>()
    this.audienceExtensionDisplayCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }
  hasTVE() {
    const subject = new Subject<boolean>()
    this.tveCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }
  hasSearch() {
    const subject = new Subject<boolean>()
    this.googleAdsCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }
  hasDFP() {
    const subject = new Subject<boolean>()
    this.dfpCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }
  hasAutoDynamic() {
    const subject = new Subject<boolean>()
    this.autoDynamicCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }
  hasSocial() {
    const subject = new Subject<boolean>()
    this.socialCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }
  hasAudio() {
    const subject = new Subject<boolean>()
    this.mappedAudioAdvertisersCampaign().subscribe(campaign => {
      if (campaign && campaign.rows[0]) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  dfpCampaign() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(catchError(() => of(null)))
  }

  dfpCreative() {
    return this.dataService
      .load('dfp_creative')
      .pipe(catchError(() => of(null)))
  }

  audienceExtensionVideoCampaign() {
    return this.dataService
      .load('audience_extension_video_campaign')
      .pipe(catchError(() => of(null)))
  }

  audienceExtensionVideoCreative() {
    return this.dataService
      .load('audience_extension_video_creative')
      .pipe(catchError(() => of(null)))
  }

  tveCampaign() {
    return this.dataService
      .load('tve_campaign')
      .pipe(catchError(() => of(null)))
  }

  tveCreative() {
    return this.dataService
      .load('tve_creative')
      .pipe(catchError(() => of(null)))
  }

  tveDeviceName() {
    return this.dataService
      .load('tve_device_name')
      .pipe(catchError(() => of(null)))
  }

  tveDaypart() {
    return this.dataService
      .load('tve_daypart')
      .pipe(catchError(() => of(null)))
  }

  videoTotal() {
    return forkJoin([this.tveCampaign(), this.audienceExtensionVideoCampaign()])
      .pipe(
        mergeMap(([tveCampaignData, audienceExtensionVideoCampaignData]) => {
          const {
            video_starts: total_tve_video_starts = 0,
            completions100: total_tve_completions = 0,
            impressions: total_tve_impressions = 0,
          }: Partial<ChartSeries> = tveCampaignData.getChartSeries(['video_starts', 'completions100', 'impressions'])
            .reduce((acc, { name, data }) => {
              acc[name] = data[0] && data[0].pop() || 0
              return acc
            }, {})
          const {
            video_starts: total_video_video_starts = 0,
            completions100: total_video_completions = 0,
            impressions: total_video_impressions = 0
          }: Partial<ChartSeries> = audienceExtensionVideoCampaignData.getChartSeries(['video_starts', 'completions100', 'impressions'])
            .reduce((acc, { name, data }) => {
              acc[name] = data[0] && data[0].pop() || 0
              return acc
            }, {})

          const video_starts = total_video_video_starts + total_tve_video_starts
          const impressions = total_video_impressions + total_tve_impressions
          if(total_tve_video_starts === 0 || total_video_video_starts === 0) {
            return of({
              impressions: impressions,
              vcr: total_tve_video_starts === 0 ? total_video_completions / video_starts : total_tve_completions / video_starts,
            })
          }
          else {
            return of({
              impressions: impressions,
              vcr: (total_video_completions + total_tve_completions) / video_starts,
            })
          }
        }),
        catchError(() => of(null))
      )
  }

  tveSites() {
    const subject = new Subject<any[]>()
    combineLatest([
      this.mappedTveTubemogulSite(),
      this.freewheelSites(),
      this.simplifiSites(),
      this.gcmSites(),
    ]).subscribe(([adobeSites, freewheelSites, simplifiSites, gcmSites]) => {
      let sites = []
      if (adobeSites && adobeSites.rows) {
        sites = sites.concat(adobeSites.rows)
      }
      if (freewheelSites && freewheelSites.rows) {
        sites = sites.concat(freewheelSites.rows)
      }
      if (simplifiSites && simplifiSites.rows) {
        sites = sites.concat(simplifiSites.rows)
      }
      if (gcmSites && gcmSites.rows) {
        sites = sites.concat(gcmSites.rows)
      }
      subject.next(sites)
    })
    return subject
  }

  mappedTveTubemogulSite() {
    return this.dataService
      .load('mapped_tve_tubemogul_site')
      .pipe(catchError(() => of(null)))
  }

  freewheelSites() {
    return this.dataService
      .load('tve_site_section')
      .pipe(catchError(() => of(null)))
  }

  simplifiSites() {
    return this.dataService
      .load('mapped_tve_simplifi_domain')
      .pipe(catchError(() => of(null)))
  }

  gcmSites() {
    return this.dataService
      .load('mapped_google_campaign_manager_domain')
      .pipe(catchError(() => of(null)))
  }

  mappedGoogleCampaignManagerCreative() {
    return this.dataService
      .load('mapped_google_campaign_manager_creative')
      .pipe(catchError(() => of(null)))
  }

  mappedVideoSimplifiTargetGeo() {
    return this.dataService
      .load('mapped_video_simplifi_target_geo')
      .pipe(catchError(() => of(null)))
  }

  mappedVideoSimplifiTargetKeyword() {
    return this.dataService
      .load('mapped_video_simplifi_keyword_name')
      .pipe(catchError(() => of(null)))
  }

  audienceExtensionDisplayCampaign() {
    return this.dataService
      .load('audience_extension_display_campaign')
      .pipe(catchError(() => of(null)))
  }

  audienceExtensionDisplayCreative() {
    return this.dataService
      .load('audience_extension_display_creative')
      .pipe(catchError(() => of(null)))
  }

  mappedDisplaySimplifiTargetGeo() {
    return this.dataService
      .load('mapped_display_simplifi_target_geo')
      .pipe(catchError(() => of(null)))
  }

  mappedDisplaySimplifiTargetKeyword() {
    return this.dataService
      .load('mapped_display_simplifi_keyword_name')
      .pipe(catchError(() => of(null)))
  }

  mappedDisplaySimplifiCreative() {
    return this.dataService
      .load('mapped_display_simplifi_creative')
      .pipe(catchError(() => of(null)))
  }

  displayTotal() {
    return forkJoin([this.audienceExtensionDisplayCampaign(), this.dfpCampaign()])
      .pipe(
        mergeMap(([displayCampaignData, dfpCampaignData]) => {
          const {
            clicks: display_clicks = 0,
            impressions: display_impressions = 0
          }: Partial<ChartSeries> = displayCampaignData.getChartSeries(['clicks', 'impressions'])
            .reduce((acc, { name, data }) => {
              acc[name] = data[0] && data[0].pop() || 0
              return acc
            }, {})
          const {
            clicks: dfp_clicks = 0,
            impressions: dfp_impressions = 0
          }: Partial<ChartSeries> = dfpCampaignData.getChartSeries(['clicks', 'impressions'])
            .reduce((acc, { name, data }) => {
              acc[name] = data[0] && data[0].pop() || 0
              return acc
            }, {})
          const impressions = dfp_impressions + display_impressions
          const clicks = dfp_clicks + display_clicks
          const ctr = clicks / impressions
          return of({
            impressions,
            clicks,
            ctr
          })
        }),
        catchError(() => of(null))
      )
  }

  googleAdsCampaign() {
    return this.dataService
      .load('google_ads_campaign')
      .pipe(catchError(() => of(null)))
  }

  googleAdsAd() {
    return this.dataService
      .load('google_ads_ad')
      .pipe(catchError(() => of(null)))
  }

  googleAdsKeyword() {
    return this.dataService
      .load('google_ads_keyword')
      .pipe(catchError(() => of(null)))
  }

  googleAdsDevice() {
    return this.dataService
      .load('google_ads_device')
      .pipe(catchError(() => of(null)))
  }

  autoDynamicCampaign() {
    return this.dataService
      .load('auto_dynamic_campaign')
      .pipe(catchError(() => of(null)))
  }

  autoDynamicCampaignAttribution() {
    return this.dataService
      .load('auto_dynamic_campaign_attribution')
      .pipe(catchError(() => of(null)))
  }

  autoDynamicCampaignNewOrUsed() {
    return this.dataService
      .load('auto_dynamic_new_or_used')
      .pipe(catchError(() => of(null)))
  }

  autoDynamicCampaignTotal() {
    return forkJoin([
      this.autoDynamicCampaign(),
      this.autoDynamicCampaignAttribution(),
      this.autoDynamicCampaignNewOrUsed(),
    ])
      .pipe(
        mergeMap(([campaignData, campaignAttributionData, campaignNewOrUsedData]) => {
          const campaign_delivered_metrics: any = campaignData.rows
            .reduce((total, row) => {
              row.metrics.forEach(({ name, value }) => {
                if (Object.keys(total.metrics).includes(name)) {
                  total.metrics[name] += value
                } else {
                  total.metrics[name] = value
                }
              })
              return total
            }, {
              id: 'total',
              name: 'Total',
              metrics: {}
            })
          const campaign = campaignAttributionData.rows
            .reduce((total, row) => {
              row.metrics.forEach(({ name, value }) => {
                if (Object.keys(total.metrics).includes(name)) {
                  total.metrics[name] += value
                } else {
                  total.metrics[name] = value
                }
              })
              return total
            }, {
              id: 'total',
              name: 'Total',
              metrics: {}
            })
          campaign_delivered_metrics.metrics = {
            ...campaign_delivered_metrics.metrics,
            ...campaign.metrics
          }
          const newIndex = campaignNewOrUsedData.rows.findIndex(row => row.getSliceId('_is_new_or_used') === 'New')
          const usedIndex = campaignNewOrUsedData.rows.findIndex(row => row.getSliceId('_is_new_or_used') === 'Used')
          if (newIndex > -1) {
            campaign_delivered_metrics.metrics.top_new_inventory = campaignNewOrUsedData.rows[newIndex].getMetricValue('_impressions')
          }
          if (usedIndex > -1) {
            campaign_delivered_metrics.metrics.top_used_inventory = campaignNewOrUsedData.rows[usedIndex].getMetricValue('_impressions')
          }
          return of(campaign_delivered_metrics)
        }),
        catchError(() => of(null))
      )
  }

  socialCampaign() {
    return this.dataService
      .load('social_campaign')
      .pipe(catchError(() => of(null)))
  }

  socialPublisherPlatform() {
    return this.dataService
      .load('social_publisher_platform')
      .pipe(catchError(() => of(null)))
  }

  socialAd() {
    return this.dataService
      .load('social_ad')
      .pipe(catchError(() => of(null)))
  }

  socialTotal() {
    return forkJoin([this.socialCampaign(), this.socialPublisherPlatform()])
      .pipe(
        mergeMap(([socialCampaignData, socialPublisherPlatformData]) => {
          let totalShare = 0
          const { _impressions, ...socialData }: Partial<ChartSeries> = socialCampaignData.getChartSeries([
            '_page_engagement',
            '_page_engagement',
            '_like',
            '_comment',
            '_post_engagement',
            '_post_reaction',
            '_onsite_conversion_post_save',
            '_rsvp',
            '_post',
            '_impressions',
          ])
            .reduce((acc, { name, data }) => {
              acc[name] = data[0] && data[0].pop() || 0
              return acc
            }, {})
          const _post_reaction = socialData._post_reaction
          const _comment = socialData._comment
          const _post = socialData._post
          const engagements: any = Object.values(socialData)
            .reduce((acc: number, value: number) => acc += value, 0)
          const engagement_rate = engagements / _impressions
          const platforms = socialPublisherPlatformData.rows.reduce((acc: { [key: string]: number }, row) => {
            const platform = row.getSliceId('_publisher_platform')
            const impressions = row.getMetricValue('_impressions')
            acc[platform] = impressions
            totalShare += impressions
            return acc
          }, {})
          const facebook_share = platforms.facebook / totalShare
          const instagram_share = platforms.instagram / totalShare
          return of({
            _post_reaction,
            _comment,
            _post,
            engagements,
            engagement_rate,
            facebook_share,
            instagram_share,
            totalShare
          })
        }),
        catchError(() => of(null))
      )
  }

  mappedAudioAdvertisersCampaign() {
    return this.dataService
      .load('mapped_audio_advertisers_campaign')
      .pipe(catchError(() => of(null)))
  }

  mappedAudioAdvertisersCreative() {
    return this.dataService
      .load('mapped_audio_advertisers_creative')
      .pipe(catchError(() => of(null)))
  }
}
