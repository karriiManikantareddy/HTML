import { Observable, Subject, ReplaySubject, forkJoin } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { Metric } from 'projects/template-module/src/lib/services/schema.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { SimplifiDataService, Metadata, Item, Dma, Region } from './simplifi-data.service'
export * from './simplifi-data.service'

@Injectable()
export class AdvertiserDataService extends SimplifiDataService {
  constructor(
    @Inject(WINDOW) window: Window,
    protected dataService: DataService,
  ) {
    super(window)
  }

  metadata() {
    return this.dataService
      .load('metadata')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const client = row.getData('client')
            return new Metadata(client['client'], this.dates)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('simplifi_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics)
          } else {
            return {}
          }
        })
      )
  }

  totalsByDay() {
    return this.dataService
      .load('totals_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  hasYoutube(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.youtubeTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  youtubeTotals() {
    return this.dataService
      .load('youtube_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics)
          } else {
            return {}
          }
        })
      )
  }

  youtubeTotalsByDay() {
    return this.dataService
      .load('youtube_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'vcr'])
          } else {
            return []
          }
        })
      )
  }

  youtubeBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('youtube_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item((ad['ad'] || 'Responsive Ad'), metrics, ad, 'youtube', null, null, row.getData('ad_group')['ad_group'], 'Ad Group')
        })
      })
    )
  }

  youtubeCampaignBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('youtube_campaign_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(campaign['campaign'], metrics, campaign, 'youtube')
        })
      })
    )
  }

  youtubeDevices(): Observable<Item[]> {
    return this.dataService
    .load('youtube_device_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device = row.getData('device')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(device['device'], metrics, device, 'youtube')
        })
      })
    )
  }

  youtubeKeywords(): Observable<Item[]> {
    return this.dataService
    .load('youtube_keyword_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const keyword = row.getData('keyword')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(keyword['keyword'], metrics, keyword, 'youtube')
        })
      })
    )
  }

  hasGoogleSearch(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.googleSearchTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  googleSearchTotals() {
    return this.dataService
      .load('google_search_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics)
          } else {
            return {}
          }
        })
      )
  }

  googleSearchTotalsByDay() {
    return this.dataService
      .load('google_search_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  googleSearchBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('google_search_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_group = row.getData('ad_group')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(ad_group['ad_group'], metrics, ad_group, 'google_search')
        })
      })
    )
  }

  googleSearchCampaignBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('google_search_campaign_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(campaign['campaign'], metrics, campaign, 'google_search')
        })
      })
    )
  }

  googleSearchDevices(): Observable<Item[]> {
    return this.dataService
    .load('google_search_device_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device = row.getData('device')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(device['device'], metrics, device, 'google_search')
        })
      })
    )
  }

  googleSearchKeywords(): Observable<Item[]> {
    return this.dataService
    .load('google_search_keyword_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const keyword = row.getData('keyword')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(keyword['keyword'], metrics, keyword, 'google_search')
        })
      })
    )
  }

  hasSimplifi(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.simplifiTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  simplifiTotalsLastPeriod() {
    let previousInterval: string;
    if (Date.create(this.dates.endDate).endOfMonth().format('{year}{MM}{dd}') == this.dates.endDate) {
      previousInterval = `${Date.create(this.dates.endDate).addMonths(-1).beginningOfMonth().format('{year}{MM}{dd}')}-${Date.create(this.dates.endDate).addMonths(-1).endOfMonth().format('{year}{MM}{dd}')}`
    } else {
      previousInterval = `${Date.create(this.dates.endDate).addMonths(-2).beginningOfMonth().format('{year}{MM}{dd}')}-${Date.create(this.dates.endDate).addMonths(-2).endOfMonth().format('{year}{MM}{dd}')}`
    }
      const subject = new ReplaySubject<any>()
      forkJoin([
        this.dataService.load('simplifi_totals_last_period', {interval: previousInterval}),
        this.dataService.load('reach_metrics_last_period', {interval: previousInterval}),
        this.dataService.load('simplifi_conversion_totals_last_period', {interval: previousInterval}),
        this.dataService.load('simplifi_video_totals_last_period', {interval: previousInterval}),
      ]).subscribe(([totals, reachTotals, conversionTotals, videoTotals]) => {
        let newTotals = {...this.getTotals(totals), ...this.getTotals(reachTotals), ...this.getTotals(videoTotals), ...this.getTotals(conversionTotals)}
        if (newTotals.reach) {
          const frequencyValue = newTotals.impressions.value / newTotals.reach.value
          const frequencyMetric: Metric = new Metric(newTotals.frequency.name, newTotals.frequency.meta)
          newTotals['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
        }
        subject.next(newTotals)
        subject.complete()
      })
      return subject
  }

  simplifiTotalsLastMonth() {
    let interval: string;
    if (Date.create(this.dates.endDate).endOfMonth().format('{year}{MM}{dd}') == this.dates.endDate) {
      interval = `${Date.create(this.dates.endDate).beginningOfMonth().format('{year}{MM}{dd}')}-${Date.create(this.dates.endDate).endOfMonth().format('{year}{MM}{dd}')}`
    } else {
      interval = `${Date.create(this.dates.endDate).addMonths(-1).beginningOfMonth().format('{year}{MM}{dd}')}-${Date.create(this.dates.endDate).addMonths(-1).endOfMonth().format('{year}{MM}{dd}')}`
    }
    const subject = new ReplaySubject<any>()
    forkJoin([
      this.dataService.load('simplifi_totals_last_month', {interval: interval}),
      this.dataService.load('reach_metrics_last_month', {interval: interval}),
      this.dataService.load('simplifi_conversion_totals_last_month', {interval: interval}),
      this.dataService.load('simplifi_video_totals_last_month', {interval: interval}),
    ]).subscribe(([totals, reachTotals, conversionTotals, videoTotals]) => {
      let newTotals = {...this.getTotals(totals), ...this.getTotals(reachTotals), ...this.getTotals(videoTotals), ...this.getTotals(conversionTotals)}
      if (newTotals.reach) {
        const frequencyValue = newTotals.impressions.value / newTotals.reach.value
        const frequencyMetric: Metric = new Metric(newTotals.frequency.name, newTotals.frequency.meta)
        newTotals['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
      }
      subject.next(newTotals)
      subject.complete()
    })
    return subject
  }

  simplifiTotals() {
    const subject = new ReplaySubject<any>()
    forkJoin([
      this.dataService.load('simplifi_totals'),
      this.dataService.load('reach_metrics'),
      this.dataService.load('simplifi_conversion_totals'),
      this.dataService.load('simplifi_video_totals'),
    ]).subscribe(([totals, reachTotals, conversionTotals, videoTotals]) => {
      let newTotals = {...this.getTotals(totals), ...this.getTotals(reachTotals), ...this.getTotals(videoTotals), ...this.getTotals(conversionTotals)}
      if (newTotals.reach) {
        const frequencyValue = newTotals.impressions.value / newTotals.reach.value
        const frequencyMetric: Metric = new Metric(newTotals.frequency.name, newTotals.frequency.meta)
        newTotals['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
      }
      subject.next(newTotals)
      subject.complete()
    })
    return subject
  }

  private getTotals(result) {
    const row = result.rows[0]
    if (row) {
      return this.metricsToHash(row.metrics)
    } else {
      return {}
    }
  }

  simplifiTotalsByDay() {
    return this.dataService
      .load('simplifi_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'display_native_ctr'])
          } else {
            return []
          }
        })
      )
  }

  simplifiReachTotals() {
    return this.dataService
      .load('reach_metrics')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics)
          } else {
            return {}
          }
        })
      )
  }

  simplifiVideoTotals() {
    return this.dataService
      .load('simplifi_video_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics)
          } else {
            return {}
          }
        })
      )
  }

  simplifiBreakdownItems(): Observable<Item[]> {
    const subject = new ReplaySubject<Item[]>()
    forkJoin([
      this.dataService.load('simplifi_breakdown'),
      this.dataService.load('ad_reach_metrics'),
      this.dataService.load('simplifi_video_breakdown'),
    ]).subscribe(([ads, reachAds, videoAds]) => {
      const items: Item[] = (ads.rows || []).map(row => {
        const ad = row.getData('ad')
        const adType = row.getSliceValue('ad_type')
        let metrics = this.metricsToHash(row.metrics)
        const reachAd = (reachAds.rows || []).find(a => a.getSliceId('ad') === row.getSliceId('ad'))
        if (reachAd) {
          metrics = {...metrics, ...this.metricsToHash(reachAd.metrics)}
          const frequencyValue = metrics.impressions.value / metrics.reach.value
          const frequencyMetric: Metric = new Metric(metrics.frequency.name, metrics.frequency.meta)
          metrics['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
        }
        const videoAd = (videoAds.rows || []).find(a => a.getSliceId('ad') === row.getSliceId('ad'))
        if (videoAd) {
          metrics = {...metrics, ...this.metricsToHash(videoAd.metrics)}
        }
        return new Item((ad['ad'] || row.getSliceValue('ad')), metrics, ad, 'simplifi', null, adType)
      })
      subject.next(items)
      subject.complete()
    })
    return subject
  }

  simplifiTacticBreakdownItems(): Observable<Item[]> {
    const subject = new ReplaySubject<Item[]>()
    forkJoin([
      this.dataService.load('simplifi_tactic_breakdown'),
      this.dataService.load('campaign_reach_metrics'),
      this.dataService.load('simplifi_video_tactic_breakdown'),
    ]).subscribe(([tactics, reachTactics, videoTactics]) => {
      const items: Item[] = (tactics.rows || []).map(row => {
        const campaign = row.getData('campaign')
        let metrics = this.metricsToHash(row.metrics)
        const reachTactic = (reachTactics.rows || []).find(a => a.getSliceId('campaign') === row.getSliceId('campaign'))
        if (reachTactic) {
          metrics = {...metrics, ...this.metricsToHash(reachTactic.metrics)}
          const frequencyValue = metrics.impressions.value / metrics.reach.value
          const frequencyMetric: Metric = new Metric(metrics.frequency.name, metrics.frequency.meta)
          metrics['frequency'] = new MetricValue(frequencyMetric, frequencyValue)
        }
        const videoTactic = (videoTactics.rows || []).find(a => a.getSliceId('campaign') === row.getSliceId('campaign'))
        if (videoTactic) {
          metrics = {...metrics, ...this.metricsToHash(videoTactic.metrics)}
        }
        return new Item(campaign['campaign'], metrics, campaign, 'simplifi')
      })
      subject.next(items)
      subject.complete()
    })
    return subject
  }

  simplifiZipImpressionsBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_zip_impressions_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', null, null, location_city, 'City')
        })
      })
    )
  }

  simplifiZipClicksBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_zip_clicks_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', null, null, location_city, 'City')
        })
      })
    )
  }

  simplifiZipOnlineVisitsBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_zip_online_visits_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', null, null, location_city, 'City')
        })
      })
    )
  }

  simplifiZipTotalVisitsBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_zip_total_visits_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', null, null, location_city, 'City')
        })
      })
    )
  }

  simplifiAdZipImpressionsBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_ad_zip_impressions_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', ad, null, location_city, 'City')
        })
      })
    )
  }
  simplifiAdZipClicksBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_ad_zip_clicks_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', ad, null, location_city, 'City')
        })
      })
    )
  }
  simplifiAdZipOnlineVisitsBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_ad_zip_online_visits_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', ad, null, location_city, 'City')
        })
      })
    )
  }
  simplifiAdZipTotalVisitsBreakdownItems(dma: string): Observable<Item[]> {
    return this.dataService
    .load('simplifi_ad_zip_total_visits_breakdown', { filters: `location_dma:any:${encodeURIComponent(dma)}` })
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_postal_code = row.getData('location_postal_code')
          const location_city: string = row.getData('location_city')['location_city']
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_postal_code['location_postal_code'], metrics, location_postal_code, 'simplifi', ad, null, location_city, 'City')
        })
      })
    )
  }

  simplifiGeofencingBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_geo_fence_breakdown')
    .pipe(
      map(result => {
        const groupedByName = (result && result.rows || []).groupBy(row => row.getSliceValue('conversion_geo_fence'))
        return Object.keys(groupedByName).map((groupKey: string) => {
          const group = groupedByName[groupKey]
          const conversion_geo_fence = group[0].getData('conversion_geo_fence')
          const actions: number = group.sum(row => row.getMetricValue('total_visits'))
          const metrics = this.metricsToHash(group[0].metrics)
          const actionMetric: MetricValue = new MetricValue(new Metric(metrics.total_visits.name, metrics.total_visits.meta), actions)
          return new Item(conversion_geo_fence['conversion_geo_fence'], {total_visits: actionMetric}, conversion_geo_fence, 'simplifi')
        })
      })
    )
  }

  simplifiTargetGeofencingBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_taget_geo_fence_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const target_geo_fence = row.getData('target_geo_fence')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(target_geo_fence['target_geo_fence'], metrics, target_geo_fence, 'simplifi')
        })
      })
    )
  }

  simplifiCityBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_city_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_city = row.getData('location_city')
          const location_region = row.getData('location_region')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(location_city['location_city'], metrics, location_city, 'simplifi', location_region['location_region'])
        })
      })
    )
  }

  simplifiRegionBreakdownItems(): Observable<Region[]> {
    return this.dataService
    .load('simplifi_region_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const location_region = row.getData('location_region')
          const metrics = this.metricsToHash(row.metrics)
          return new Region(location_region['location_region'], metrics)
        })
      })
    )
  }

  simplifiAudienceBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_segment_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const segment_name = row.getData('segment_name')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(segment_name['segment_name'], metrics, segment_name, 'simplifi')
        })
      })
    )
  }

  simplifiDisplayDomainBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_display_domain_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const domain_reporting_name = row.getData('domain_reporting_name')
          const adType = row.getSliceValue('ad_type')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(domain_reporting_name['domain_reporting_name'], metrics, adType, 'simplifi')
        })
      })
    )
  }

  simplifiVideoDomainBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_video_domain_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const domain_reporting_name = row.getData('domain_reporting_name')
          const adType = row.getSliceValue('ad_type')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(domain_reporting_name['domain_reporting_name'], metrics, adType, 'simplifi')
        })
      })
    )
  }

  simplifiTopDma(): Observable<string> {
    return this.dataService
    .load('simplifi_top_dma')
    .pipe(
      map(result => {
        const row = result && result.rows[0]
        if (row) {
          return row.getSliceValue('location_dma')
        }
      })
    )
  }

  simplifiKeywordsBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_keywords_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const keyword = row.getData('keyword')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(keyword['keyword'], metrics, keyword, 'simplifi')
        })
      })
    )
  }

  simplifiDeviceBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_device_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const browser_device = row.getData('browser_device')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(browser_device['browser_device'], metrics, browser_device, 'simplifi')
        })
      })
    )
  }

  hasFacebook(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.facebookTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  facebookTotals() {
    return this.dataService
      .load('facebook_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics)
          } else {
            return {}
          }
        })
      )
  }

  facebookTotalsByDay() {
    return this.dataService
      .load('facebook_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'link_click_ctr'])
          } else {
            return []
          }
        })
      )
  }

  facebookBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('facebook_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(ad['ad'], metrics, ad, 'facebook', row.getData('ad_set')['ad_set'])
        })
      })
    )
  }

  facebookCampaignBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('facebook_campaign_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign')
          let metrics = this.metricsToHash(row.metrics)
          let reachValue: number = row.getData('campaign')['reach']
          let mapped_platform = row.getSliceValue('mapped_platform')
          if (reachValue) {
            metrics['reach'] = new MetricValue(new Metric('Reach', {}), reachValue)
            metrics['frequency'] = new MetricValue(new Metric('Frequency', {'display': {'format': 'decimal'}}), metrics.impressions.value / reachValue)
          }
          return new Item(campaign['campaign'], metrics, campaign, mapped_platform)
        })
      })
    )
  }

  facebookPlacementsBreakdowns(): Observable<Item[]> {
    return this.dataService
    .load('facebook_placement_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const platform_position = row.getData('platform_position')
          let metrics = this.metricsToHash(row.metrics)
          return new Item(platform_position['platform_position'], metrics, platform_position)
        })
      })
    )
  }
  facebookGenders(): Observable<Item[]> {
    return this.dataService
    .load('facebook_gender')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const gender = row.getData('gender')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(gender['gender'], metrics, gender, 'facebook')
        })
      })
    )
  }

  facebookAges(): Observable<Item[]> {
    return this.dataService
    .load('facebook_age')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const age = row.getData('age')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(age['age'], metrics, age, 'facebook')
        })
      })
    )
  }

  facebookDevices(): Observable<Item[]> {
    return this.dataService
    .load('facebook_device')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device = row.getData('impression_device');
          const metrics = this.metricsToHash(row.metrics);
          const name = (device['impression_device'].replace(/_/g, ' ')).charAt(0).toUpperCase() + (device['impression_device'].replace(/_/g, ' ')).slice(1) ;
          return new Item(name, metrics, device, '');
        });
      })
    )
  }

  facebookPlatforms(): Observable<Item[]> {
    return this.dataService
    .load('facebook_platform')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device = row.getData('mapped_platform');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(device['mapped_platform'], metrics, device, 'facebook');
        });
      })
    )
  }

  hasSimplifiNative(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.simplifiNativeTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    })
    return subject;
  }

  simplifiNativeTotals() {
    return this.dataService
      .load('simplifi_native_totals')
      .pipe(
        map(result => {
          const row = result.rows[0];
          if (row) {
            return this.metricsToHash(row.metrics);
          } else {
            return {};
          }
        })
      )
  }

  simplifiNativeByDay() {
    return this.dataService
      .load('simplifi_native_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'ctr']);
          } else {
            return [];
          }
        })
      )
  }

  simplifiNativeCampaignBreakdown(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_native_campaign')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign_id');
          let metrics = this.metricsToHash(row.metrics);
          return new Item(campaign['campaign_id'], metrics, campaign);
        })
      })
    )
  }

  simplifiNativeCreativeBreakdown(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_native_creative')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('creative_id');
          let metrics = this.metricsToHash(row.metrics);
          return new Item(campaign['creative_id'], metrics, campaign);
        })
      })
    )
  }

  facebookAdSet(): Observable<Item[]> {
    return this.dataService
    .load('facebook_adset')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('ad_set')
          let metrics = this.metricsToHash(row.metrics)
          return new Item(campaign['ad_set'], metrics, campaign, 'Facebook')
        })
      })
    )
  }

  facebookConversionByDay() {
    return this.dataService
      .load('facebook_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['conversions', 'conversion_rate'])
          } else {
            return []
          }
        })
      )
  }

  simplifiNativeDevice() {
    return this.dataService
    .load('simplifi_native_device')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device = row.getData('device_type');
          let metrics = this.metricsToHash(row.metrics);
          return new Item(device['device_type'], metrics, device);
        })
      })
    )
  }

  simplifiNativeDomain() {
    return this.dataService
    .load('simplifi_native_domain')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const domain = row.getData('domain_name');
          let metrics = this.metricsToHash(row.metrics);
          return new Item(domain['domain_name'], metrics, domain);
        })
      })
    )
  }

  facebookDma(): Observable<Item[]> {
    return this.dataService
    .load('facebook_dma')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const dma = row.getData('dma');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(dma['dma'], metrics, 'Facebook');
        })
      })
    )
  }

  simplifiAudioDomainBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('simplifi_audio_domain_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const domain_reporting_name = row.getData('domain_reporting_name');
          const adType = row.getSliceValue('ad_type');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(domain_reporting_name['domain_reporting_name'], metrics, adType, 'simplifi');
        })
      })
    )
  }

  simplifiTopDmaList() {
    return this.dataService
    .load('simplifi_top_dma')
    .pipe(
      map(result => {
        const data = result?.rows.map(row => ({
          data: row.getSliceValue('location_dma')
        })) || [];
        return data
      })
    )
  }

  protected metricsToHash(metrics: MetricValue[]): Partial<Record<string, MetricValue>> {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric
      return memo
    }, <Partial<Record<string, MetricValue>>> {})
  }
}
