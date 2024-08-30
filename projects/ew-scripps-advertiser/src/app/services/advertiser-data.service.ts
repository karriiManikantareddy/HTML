import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { EwScrippsDataService, Metadata, Item} from './ew-scripps-data.service'
export * from './ew-scripps-data.service'

@Injectable()
export class AdvertiserDataService extends EwScrippsDataService {
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
            const advertiser = row.getData('advertiser')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('totals')
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

  attributionTotals() {
    return this.dataService
      .load('total_attribution')
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
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'visits'])
          } else {
            return []
          }
        })
      )
  }

  hasGam(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.gamTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  gamLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ad_manager_line_items')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(line_item['line_item'], metrics, line_item, 'gam')
        })
      })
    )
  }

  gamBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ad_manager_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, creative, 'gam', row.getData('line_item')['line_item'])
        })
      })
    )
  }

  gamTotals() {
    return this.dataService
      .load('mapped_google_ad_manager_totals')
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

  gamTotalsByDay() {
    return this.dataService
      .load('mapped_google_ad_manager_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['total_line_item_level_impressions', 'total_line_item_level_clicks', 'ctr', 'vcr'])
          } else {
            return []
          }
        })
      )
  }

  hasCallrail(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.callrailTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  callrailTotals() {
    return this.dataService
      .load('mapped_callrail_totals')
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

  callrailTotalsByDay() {
    return this.dataService
      .load('mapped_callrail_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['total_calls', 'answer_rate', 'average_duration'])
          } else {
            return []
          }
        })
      )
  }

  callrailBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_callrail_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const call = row.getData('call')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(call['call'], metrics, call, 'calls')
        })
      })
    )
  }

  hasGdn(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.gdnTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  gdnTotals() {
    return this.dataService
      .load('mapped_google_ads_display_totals')
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

  gdnTotalsByDay() {
    return this.dataService
      .load('mapped_google_ads_display_by_day')
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

  gdnBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ads_display_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item((ad['ad'] || 'Responsive Ad'), metrics, ad, 'google_display', row.getData('ad_group')['ad_group'])
        })
      })
    )
  }

  gdnAdGroupBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ads_display_ad_groups')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_group = row.getData('ad_group')
          const metrics = this.metricsToHash(row.metrics)
          return new Item((ad_group['ad_group'] || 'Responsive Ad'), metrics, ad_group, 'google_display')
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
      .load('mapped_google_ads_search_totals')
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
      .load('mapped_google_ads_search_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'conversions'])
          } else {
            return []
          }
        })
      )
  }

  googleSearchBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ads_search_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item((ad['ad'] || 'Responsive Ad'), metrics, ad, 'google_search', row.getData('ad_group')['ad_group'])
        })
      })
    )
  }

  googleSearchAdGroupBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ads_search_ad_groups')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_group = row.getData('ad_group')
          const metrics = this.metricsToHash(row.metrics)
          return new Item((ad_group['ad_group'] || 'Responsive Ad'), metrics, ad_group, 'google_search')
        })
      })
    )
  }

  hasGooglePerformanceMax(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.googlePerformanceMaxTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  googlePerformanceMaxTotals() {
    return this.dataService
      .load('mapped_google_ads_performance_max_totals')
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

  googlePerformanceMaxTotalsByDay() {
    return this.dataService
      .load('mapped_google_ads_performance_max_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'conversions'])
          } else {
            return []
          }
        })
      )
  }

  googlePerformanceMaxBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('mapped_google_ads_performance_max_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const campaign = row.getData('campaign')
            const metrics = this.metricsToHash(row.metrics)
            return new Item(campaign['campaign'], metrics, campaign, 'google_performance_max')
          })
        })
      )
  }

  hasGroundtruth(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.groundtruthTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  groundtruthTotals() {
    return this.dataService
      .load('mapped_groundtruth_totals')
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

  groundtruthTotalsByDay() {
    return this.dataService
      .load('mapped_groundtruth_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'visits'])
          } else {
            return []
          }
        })
      )
  }

  groundtruthAdgroupBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_groundtruth_adgroups')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const adgroup = row.getData('adgroup')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(adgroup['adgroup'], metrics, adgroup, 'groundtruth')
        })
      })
    )
  }

  groundtruthZipBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_groundtruth_zips')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const zip = row.getData('zip')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(zip['zip'], metrics, zip, 'groundtruth')
        })
      })
    )
  }

  groundtruthBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_groundtruth_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, creative, 'groundtruth', row.getData('adgroup')['adgroup'])
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
      .load('mapped_facebook_totals')
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
      .load('mapped_facebook_by_day')
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

  facebookAdSetBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_facebook_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_set = row.getData('ad_set')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(ad_set['ad_set'], metrics, ad_set, 'facebook')
        })
      })
    )
  }

  facebookBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_facebook_breakdown')
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

  hasMadhive(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.madhiveTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  madhiveTotals() {
    return this.dataService
      .load('mapped_madhive_totals')
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

  madhiveTotalsByDay() {
    return this.dataService
      .load('mapped_madhive_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions_total', 'vcr'])
          } else {
            return []
          }
        })
      )
  }

  madhiveBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_madhive_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, creative, 'madhive')
        })
      })
    )
  }

  madhivePublisherBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_madhive_publisher_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const publisher = row.getData('publisher')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(publisher['publisher'], metrics, publisher, 'madhive')
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

  simplifiTotals() {
    return this.dataService
      .load('mapped_simplifi_totals')
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

  simplifiTotalsByDay() {
    return this.dataService
      .load('mapped_simplifi_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'vcr'])
          } else {
            return []
          }
        })
      )
  }

  simplifiCampaignBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_simplifi_campaigns')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(campaign['campaign'], metrics, campaign, 'simplifi')
        })
      })
    )
  }

  simplifiBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_simplifi_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('ad')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(ad['ad'], metrics, ad, 'simplifi', row.getData('campaign')['campaign'])
        })
      })
    )
  }

  hasSiteImpact(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.siteImpactTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  siteImpactTotals() {
    return this.dataService
      .load('mapped_site_impact_totals')
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

  siteImpactTotalsByDay() {
    return this.dataService
      .load('mapped_site_impact_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['opens', 'open_rate', 'clicks'])
          } else {
            return []
          }
        })
      )
  }

  siteImpactBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_site_impact_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(campaign['campaign'], metrics, campaign, 'site_impact')
        })
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
      .load('mapped_google_ads_youtube_totals')
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
      .load('mapped_google_ads_youtube_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'vcr'])
          } else {
            return []
          }
        })
      )
  }

  youtubeBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('mapped_google_ads_youtube_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_group = row.getData('ad_group')
          const metrics = this.metricsToHash(row.metrics)
          return new Item((ad_group['ad_group'] || row.getSliceValue('ad_group')), metrics, ad_group, 'youtube')
        })
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
