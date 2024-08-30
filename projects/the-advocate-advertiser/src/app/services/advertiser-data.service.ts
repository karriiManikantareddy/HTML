import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { TheAdvocateDataService, Metadata, Item, Metro, City} from './the-advocate-data.service';
export * from './the-advocate-data.service'

@Injectable()
export class AdvertiserDataService extends TheAdvocateDataService {
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
            const advertiser_name = row.getData('advertiser_name')
            return new Metadata(advertiser_name['advertiser_name'], this.dates, advertiser_name)
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

  hasOnsiteDisplay(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.onsiteDisplayTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  onsiteDisplayBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('onsite_display_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const creative = row.getData('creative');
            const creative_preview = row.getSliceValue('creative_preview_url');
            const creative_height = row.getSliceValue('creative_height');
            const creative_width = row.getSliceValue('creative_width');
            const metrics = this.metricsToHash(row.metrics);
            const newItem = new Item(
              creative['creative'],
              metrics,
              { preview_url: creative_preview, height: creative_height, width: creative_width },
              'gam',
              creative_height + ' x ' + creative_width
            );
            return newItem;
          });
        })
      );
  }
  
  onsiteDisplayCleanName(): Observable<Item[]> {
    return this.dataService
      .load('onsite_display_breakdown_clean_name')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const creative = row.getData('creative');
            const clean_name = row.getData('creative_clean_name');
            const creative_size = row.getSliceValue('creative_size');
            const [creative_width, creative_height] = creative_size?.split(' x ').map(value => value.trim());
            const metrics = this.metricsToHash(row.metrics);
            const newItem = new Item(
              clean_name['creative_clean_name'],
              metrics,
              { height: creative_height, width: creative_width },
              creative['creative'],
              creative_height + ' x ' + creative_width
            );
            return newItem;
          });
        })
      );
  }

  onsiteDisplayLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('onsite_display_line_item_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const line_item = row.getData('line_item');
            const metrics = this.metricsToHash(row.metrics);
            const newItem = new Item(line_item['line_item'], metrics, line_item, 'gam', null);
            return newItem;
          });
        })
      );
  }
  

  onsiteDisplayMetroBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('onsite_display_metro_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const metro = row.getSliceValue('city');
            const metrics = this.metricsToHash(row.metrics);
            const newMetro = new City(metro, null, metrics);
            return newMetro;
          });
        })
      );
  }

  onsiteDisplayTotals() {
    return this.dataService
      .load('onsite_display_totals')
      .pipe(
        map(result => {
          const row = result.rows[0];
          if (row) {
            return this.metricsToHash(row.metrics);
          } else {
            return {};
          }
        })
      );
  }

  onsiteDisplayTotalsByDay() {
    return this.dataService
      .load('onsite_display_by_day')
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

  hasOnsiteVideo(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.onsiteVideoTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  onsiteVideoBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('onsite_video_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, null, 'gam_video', null)
        })
      })
    )
  }

  onsiteVideoMetroBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('onsite_video_metro_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const metro = row.getSliceValue('metro')
          const metrics = this.metricsToHash(row.metrics)
          return new Metro(metro, null, metrics)
        })
      })
    )
  }

  onsiteVideoTotals() {
    return this.dataService
      .load('onsite_video_totals')
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

  onsiteVideoTotalsByDay() {
    return this.dataService
      .load('onsite_video_by_day')
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

  hasNewsletters(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.newslettersTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  newslettersBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('newsletters_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const creative_preview = row.getSliceValue('creative_preview_url')
          const creative_height = row.getSliceValue('creative_height')
          const creative_width = row.getSliceValue('creative_width')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, {preview_url: creative_preview, height: creative_height, width: creative_width}, 'gam', creative_height + ' x ' + creative_width)
        })
      })
    )
  }

  newslettersCleanName(): Observable<Item[]> {
    return this.dataService
    .load('newsletters_breakdown_clean_name')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const clean_name = row.getData('creative_clean_name');
          const creative_size = row.getSliceValue('creative_size');
          const [creative_width, creative_height] = creative_size?.split(' x ').map(value => value.trim());
          const metrics = this.metricsToHash(row.metrics)
          return new Item(clean_name['creative_clean_name'], metrics, {height: creative_height, width: creative_width}, creative['creative'], creative_height + ' x ' + creative_width)
        })
      })
    )
  }

  newslettersLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('newsletters_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(line_item['line_item'], metrics, line_item, 'gam', null)
        })
      })
    )
  }

  newslettersMetroBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('newsletters_metro_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || [])
        .filter(row => {
          const line_item = row.getData('line_item')
          return line_item && (line_item.line_item.toLowerCase().includes('inv') || line_item.line_item.toLowerCase().includes('instory') || line_item.line_item.toLowerCase().includes('newsletter'))
        })
        .map(row => {
          const metro = row.getSliceValue('city')
          const metrics = this.metricsToHash(row.metrics)
          return new City(metro, null, metrics)
        })
      })
    )
  }

  newslettersTotals() {
    return this.dataService
      .load('newsletters_totals')
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

  newslettersTotalsByDay() {
    return this.dataService
      .load('newsletters_by_day')
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

  hasStreamingTv(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.streamingTvTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  streamingTvBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_tv_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, creative, 'streaming_tv', row.getData('line_item')['line_item'])
        })
      })
    )
  }

  streamingTvLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_tv_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(line_item['line_item'], metrics, line_item, 'streaming_tv', null)
        })
      })
    )
  }

  streamingTvAppBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_tv_app_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const app_url = row.getData('app_url')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(app_url['app_url'], metrics, app_url, 'streaming_tv', null)
        })
      })
    )
  }

  streamingTvGeoBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_tv_geo_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const geo = row.getData('geo')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(geo['geo'], metrics, geo, 'streaming_tv', null)
        })
      })
    )
  }

  streamingTvTotals() {
    return this.dataService
      .load('streaming_tv_totals')
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

  streamingTvTotalsByDay() {
    return this.dataService
      .load('streaming_tv_by_day')
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

  hasStreamingRadio(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.streamingRadioTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  streamingRadioBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_radio_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, creative, 'streaming_radio', row.getData('line_item')['line_item'])
        })
      })
    )
  }

  streamingRadioLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_radio_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(line_item['line_item'], metrics, line_item, 'streaming_radio', null)
        })
      })
    )
  }

  streamingRadioAppBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('streaming_radio_app_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const app_url = row.getData('app_url')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(app_url['app_url'], metrics, app_url, 'streaming_radio', null)
        })
      })
    )
  }

  streamingRadioTotals() {
    return this.dataService
      .load('streaming_radio_totals')
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

  streamingRadioTotalsByDay() {
    return this.dataService
      .load('streaming_radio_by_day')
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

  youtubeBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('youtube_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(line_item['line_item'], metrics, line_item, 'gam', null)
        })
      })
    )
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
            return result.getChartSeries(['impressions', 'clicks', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  hasExtendedNetworkDisplay(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.extendedNetworkDisplayTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  extendedNetworkDisplayBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('extended_display_breakdown')
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

  extendedNetworkDisplayLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('extended_display_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(line_item['line_item'], metrics, line_item, 'gam', null)
        })
      })
    )
  }

  extendedNetworkDisplayTotals() {
    return this.dataService
      .load('extended_display_totals')
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

  extendedNetworkDisplayTotalsByDay() {
    return this.dataService
      .load('extended_display_by_day')
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

  extendedNetworkMetroBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('extended_display_city_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || [])
        .filter(row => {
          const insertion_order = row.getData('insertion_order')
          return insertion_order && (!insertion_order.insertion_order.toLowerCase().includes('preroll') && !insertion_order.insertion_order.toLowerCase().includes('pre-roll') && !insertion_order.insertion_order.toLowerCase().includes('ott')
          && !insertion_order.insertion_order.toLowerCase().includes('streaming radio') && !insertion_order.insertion_order.toLowerCase().includes('youtube') && !insertion_order.insertion_order.toLowerCase().includes('yt'))
        })
        .map(row => {
          const metro = row.getSliceValue('city')
          const metrics = this.metricsToHash(row.metrics)
          return new City(metro, null, metrics)
        })
      })
    )
  }

  hasPrerollVideo(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.prerollVideoTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  prerollVideoBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('preroll_video_breakdown')
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

  prerollVideoAppBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('preroll_video_app_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const app_url = row.getData('app_url')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(app_url['app_url'], metrics, app_url, 'streaming_tv', null)
        })
      })
    )
  }

  prerollVideoTotals() {
    return this.dataService
      .load('preroll_video_totals')
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

  prerollVideoTotalsByDay() {
    return this.dataService
      .load('preroll_video_by_day')
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
      .load('google_ads_totals')
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
      .load('google_ads_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr', 'conversions','search impressions'])
          } else {
            return []
          }
        })
      )
  }

  googleSearchBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('google_ads_breakdown')
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

  hasGoogleAnalytics(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.googleAnalyticsTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  googleAnalyticsTotals() {
    return this.dataService
      .load('google_analytics_totals')
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

  googleAnalyticsTotalsByDay() {
    return this.dataService
      .load('google_analytics_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['active_users', 'sessions'])
          } else {
            return []
          }
        })
      )
  }

  googleAnalyticsChannelBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('google_analytics_channel')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const first_user_default_channel_group = row.getSliceValue('first_user_default_channel_group')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(first_user_default_channel_group, metrics, null, 'google_analytics', null)
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
            return result.getChartSeries(['impressions', 'clicks', 'ctr'])
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
          const metrics = this.metricsToHash(row.metrics)
          return new Item(campaign['campaign'], metrics, campaign, 'facebook', null)
        })
      })
    )
  }

  facebookAdSetBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('facebook_ad_set_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_set = row.getData('ad_set')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(ad_set['ad_set'], metrics, ad_set, 'facebook', null)
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
      .load('site_impact_totals')
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
      .load('site_impact_by_day')
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
      .load('site_impact_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const campaign = row.getData('campaign');
            const broadcast_date = row.getSliceValue('campaign_broadcast_date');
            const metrics = this.metricsToHash(row.metrics);
            return new Item(campaign['campaign'], metrics, campaign, 'site_impact', broadcast_date);
          });
        })
      );
  }  

  siteImpactDeviceBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('site_impact_device_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device = row.getData('device')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(device['device'], metrics, device, 'site_impact')
        })
      })
    )
  }

  hasBrandedContent(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.brandedContentTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  brandedContentTotals() {
    return this.dataService
      .load('branded_content_totals')
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

  brandedContentTotalsByDay() {
    return this.dataService
      .load('branded_content_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['article_page_views', 'article_ad_impressions'])
          } else {
            return []
          }
        })
      )
  }

  brandedContentArticleBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('branded_content_article_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const branded_content_article = row.getSliceValue('branded_content_article')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(branded_content_article, metrics, null, 'branded_content', null)
        })
      })
    )
  }

  hasSemKeywords(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.semKeywordreakdown().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    })
    return subject;
  }
  
  semKeywordreakdown(): Observable<Item[]> {
    return this.dataService
    .load('sem_keywords_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const keyword = row.getData('keyword');
          const adGroup = row.getSliceValue('ad_group');
          const campaign = row.getSliceValue('campaign');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(keyword['keyword'], metrics, {ad_group: adGroup, campaign: campaign}, 'keyword', null);
        })
      })
    )
  }

  hasAmazonVideo(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.amazonVideoTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    });
    return subject;
  }

  amazonVideoTotals() {
    return this.dataService
      .load('amazon_video_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            return this.metricsToHash(row.metrics);
          } else {
            return {};
          }
        })
      )
  }

  amazonVideoTotalsByDay() {
    return this.dataService
      .load('amazon_video_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr']);
          } else {
            return [];
          }
        })
      );
  }

  amazonVideoBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('amazon_video_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(creative['creative'], metrics, '');
        })
      })
    );
  }

  amazonVideoLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('amazon_video_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(line_item['line_item'], metrics, line_item, '', null);
        })
      })
    );
  }

  hasAmazonDisplay(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.amazonDisplayTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    });
    return subject;
  }

  amazonDisplayTotals() {
    return this.dataService
      .load('amazon_display_totals')
      .pipe(
        map(result => {
          const row = result.rows[0];
          if (row) {
            return this.metricsToHash(row.metrics);
          } else {
            return {};
          }
        })
      );
  }

  amazonDisplayTotalsByDay() {
    return this.dataService
      .load('amazon_display_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr']);
          } else {
            return [];
          }
        })
      );
  }

  amazonDisplayBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('amazon_display_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(creative['creative'], metrics, '');
        })
      })
    );
  }

  amazonDisplayLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('amazon_display_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('line_item');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(line_item['line_item'], metrics, line_item, '', null);
        })
      })
    );
  }

  hasSocial(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.socialTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    })
    return subject;
  }

  socialTotals() {
    return this.dataService
      .load('social_totals')
      .pipe(
        map(result => {
          const row = result.rows[0];
          if (row) {
            return this.metricsToHash(row.metrics);
          } else {
            return {};
          }
        })
      );
  }

  socialByDay() {
    return this.dataService
      .load('social_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['total_impressions', 'total_clicks', 'ctr']);
          } else {
            return [];
          }
        })
      );
  }

  hasProgrammaticVideo(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.programmaticVideoTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    })
    return subject;
  }

  programmaticVideoTotals() {
    return this.dataService
      .load('programmatic_video_totals')
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

  programmaticVideoTotalsByDay() {
    return this.dataService
      .load('programmatic_video_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr']);
          } else {
            return [];
          }
        })
      );
  }

  programmaticVideoBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('programmatic_video_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(creative['creative'], metrics, '');
        })
      })
    );
  }

  programmaticVideoLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('programmatic_video_line_item_breakdown')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const line_item = row.getData('ad_group');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(line_item['ad_group'], metrics, line_item, '', null);
        })
      })
    );
  }

  hasGeoFencing(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.geoFencingOverview().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  geoFencingOverview() {
    return this.dataService
    .load('geofencing_breakdown')
    .pipe(
      map(result => {
        const row = result.rows[0];
        if (row) {
          const metrics = this.metricsToHash(row.metrics);
          return metrics;
        } else {
          return {};
        }
      })
    )
  }

  geoFencingByDay() {
    return this.dataService
      .load('geofencing_by_day')
      .pipe(
        map(result => {
          if (result) {
            const series = result.getChartSeries(['impressions', 'clicks', 'ctr']);
            return series;
          } else {
            return [];
          }
        })
      );
  }  

  geoFencingCampaigns(): Observable<Item[]> {
    return this.dataService
    .load('geofencing_campaigns')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad_group = row.getData('ad_group')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(ad_group['ad_group'], metrics, ad_group, null, null)
        })
      })
    )
  }

  geoFencingCreatives(): Observable<Item[]> {
    return this.dataService
    .load('geofencing_creatives')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new Item(creative['creative'], metrics, creative, null, null)
        })
      })
    )
  }

  geoFencingCity(): Observable<Item[]> {
    return this.dataService
    .load('geofencing_geo')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const metro = row.getSliceValue('city')
          const metrics = this.metricsToHash(row.metrics)
          return new City(metro, null, metrics)
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

  hasTikTok(): Observable<boolean> {
    const subject = new Subject<boolean>()
    this.tiktokDisplayTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  tiktokDisplayTotals() {
    return this.dataService
      .load('tiktok_display_totals')
      .pipe(
        map(result => {
          const row = result.rows[0];
          if (row) {
            const metrics = this.metricsToHash(row.metrics);
            return metrics;
          } else {
            return {};
          }
        })
      );
  }
  

  tiktokDisplayTotalsByDay() {
    return this.dataService
      .load('tiktok_display_by_day')
      .pipe(
        map(result => {
          if (result) {
            const series = result.getChartSeries(['impressions', 'clicks', 'ctr']);
            return series;
          } else {
            return [];
          }
        })
      );
  }  

  tiktokDisplayLineItemBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('tiktok_line_item_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const adgroup = row.getData('adgroup');
            const metrics = this.metricsToHash(row.metrics);
            return new Item(adgroup['adgroup'], metrics, adgroup, '', null);
          });
        })
      );
  }

  tiktokBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('tiktok_breakdown')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const ad = row.getData('ad');
            const metrics = this.metricsToHash(row.metrics);
            return new Item(ad['ad'], metrics, null, '', null)
          });
        })
      );
  }
  
  hasGoogleAds(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.googleAdsCitiesBreakdownItems().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    })
    return subject;
  }

  googleAdsCitiesBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('google_ads_geo')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const metro = row.getSliceValue('city');
            const metrics = this.metricsToHash(row.metrics);
            return new City(metro, null, metrics);
          });
        })
      );
  }

  hasLinkedIn(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.linkedInTotals().subscribe(totals => {
      if (Object.keys(totals).length > 0) {
        return subject.next(true);
      } else {
        return subject.next(false);
      }
    })
    return subject;
  }

  linkedInTotals() {
    return this.dataService
      .load('linkedin_totals')
      .pipe(
        map(result => {
          const row = result.rows[0];
          if (row) {
            return this.metricsToHash(row.metrics);
          } else {
            return {};
          }
        })
      );
  }

  linkedInTotalsByDay() {
    return this.dataService
      .load('linkedin_by_day')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'clicks', 'ctr']);
          } else {
            return [];
          }
        })
      );
  } 
  
  linkedInCampaignBreakdownItems(): Observable<Item[]> {
    return this.dataService
    .load('linkedin_campaign')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const campaign = row.getData('campaign');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(campaign['campaign'], metrics, campaign, 'linkedIn', null);
        })
      })
    )
  }

  linkedInCreative(): Observable<Item[]> {
    return this.dataService
    .load('linkedin_creative')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const creative = row.getData('creative');
          const metrics = this.metricsToHash(row.metrics);
          return new Item(creative['creative'], metrics, '');
        })
      })
    );
  }

  linkedInCitiesBreakdownItems(): Observable<Item[]> {
    return this.dataService
      .load('linked_geo')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const metro = row.getSliceValue('member_region');
            const metrics = this.metricsToHash(row.metrics);
            return new City(metro, null, metrics);
          });
        })
      );
  }
  
}
