import { Subject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { SettingState } from 'projects/settings-module/src/lib/setting.state'
import { DataService } from 'projects/template-module/src/public_api'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { HearstNewspapersDataService, Metadata, SocialCampaign, Ad, EmailAd, Link, Platform } from './hearst-newspapers-data.service'
export * from './hearst-newspapers-data.service'

@Injectable()
export class AdvertiserDataService extends HearstNewspapersDataService {
  constructor(
    @Inject(WINDOW) window: Window,
    protected dataService: DataService,
    private settingState: SettingState,
  ) {
    super(window)
  }

  metadata() {
    const subject = new Subject<Metadata>()
    combineLatest([
      this.socialMetadata(),
      this.displayMetadata(),
      this.emailMetadata(),
      this.newsletterMetadata(),
      this.seoMetadata(),
      this.localEdgeWebMetadata(),
      this.semMetadata(),
    ]).subscribe(([social, display, email, newsletter, seo, localEdgeWeb, sem]) => {
      if (social) {
        this.setMarketStyle(social.market)
        subject.next(social)
      } else if (display) {
        this.setMarketStyle(display.market)
        subject.next(display)
      } else if (email) {
        this.setMarketStyle(email.market)
        subject.next(email)
      } else if (newsletter) {
        this.setMarketStyle(newsletter.market)
        subject.next(newsletter)
      } else if (seo) {
        this.setMarketStyle(seo.market)
        subject.next(seo)
      } else if (localEdgeWeb) {
        this.setMarketStyle(localEdgeWeb.market)
        subject.next(localEdgeWeb)
      } else if (sem) {
        this.setMarketStyle(sem.market)
        subject.next(sem)
      }
    })
    return subject
  }

  setMarketStyle(market) {
    switch (market) {
      case 'Houston': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'houston' })
        break
      }
      case 'Connecticut': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'connecticut' })
        break
      }
      case 'San Antonio': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'san_antionio' })
        break
      }
      case 'San Francisco': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'san_francisco' })
        break
      }
      case 'Albany': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'albany' })
        break
      }
      case 'Texas Communities': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'communities' })
        break
      }
      case 'Midwest Communities': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'communities' })
        break
      }
      case 'Seattle': {
        this.settingState.updateState({ settingId: 'colorTheme', newState: 'communities' })
        break
      }
    }
  }

  socialMetadata() {
    return this.dataService
      .load('social_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  displayMetadata() {
    return this.dataService
      .load('display_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  emailMetadata() {
    return this.dataService
      .load('email_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  newsletterMetadata() {
    return this.dataService
      .load('newsletters_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  seoMetadata() {
    return this.dataService
      .load('localedge_seo_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  localEdgeWebMetadata() {
    return this.dataService
      .load('localedge_web_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  semMetadata() {
    return this.dataService
      .load('sem_totals')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiser = row.getData('advertiser')
            const market = row.getData('entity')
            return new Metadata(advertiser['advertiser'], this.dates, advertiser, market)
          }
        })
      )
  }

  hasSocial() {
    const subject = new Subject<boolean>()
    this.socialTotals().subscribe(totals => {
      if (totals.impressions && totals.impressions.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  socialTotals() {
    return this.dataService
      .load('social_totals')
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

  socialAdvertiserByWeek() {
    return this.dataService
      .load('social_advertiser_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'link_clicks', 'link_clicks_ctr', 'landing_page_views'])
          } else {
            return []
          }
        })
      )
  }

  socialCampaigns() {
    return this.dataService
      .load('social_campaign')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const campaign = row.getData('campaign')
            const metrics = this.metricsToHash(row.metrics)
            return new SocialCampaign(campaign['campaign'], metrics)
          })
        })
      )
  }

  socialAds() {
    return this.dataService
      .load('social_ad')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const ad = row.getData('ad')
            const metrics = this.metricsToHash(row.metrics)
            return new Ad(ad, metrics)
          })
        })
      )
  }

  socialPlatforms() {
    return this.dataService
      .load('social_platform')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const platform = row.getData('platform')
            const metrics = this.metricsToHash(row.metrics)
            return new Platform(platform['platform'], metrics)
          })
        })
      )
  }

  hasDisplay() {
    const subject = new Subject<boolean>()
    this.displayTotals().subscribe(totals => {
      if (totals.impressions && totals.impressions.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  displayTotals() {
    return this.dataService
      .load('display_totals')
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

  displayWeeklyTotals() {
    return this.dataService
      .load('display_weekly')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  displayAds() {
    return this.dataService
      .load('display_creatives')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const creative = row.getData('creative')
            const metrics = this.metricsToHash(row.metrics)
            return new Ad(creative, metrics)
          })
        })
      )
  }

  hasEmail() {
    const subject = new Subject<boolean>()
    this.emailTotals().subscribe(totals => {
      if (totals.records && totals.records.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  emailTotals() {
    return this.dataService
      .load('email_totals')
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

  emailWeeklyTotals() {
    return this.dataService
      .load('email_weekly')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['records', 'click_rate'])
          } else {
            return []
          }
        })
      )
  }

  emailAds() {
    return this.dataService
      .load('email_creatives')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const campaign = row.getSliceValue('campaign')
            const subject = row.getSliceValue('subject')
            const from = row.getSliceValue('from')
            const screenshot = row.getSliceValue('screenshot')
            const metrics = this.metricsToHash(row.metrics)
            return new EmailAd(campaign, subject, from, screenshot, metrics)
          })
        })
      )
  }

  emailLinks() {
    return this.dataService
      .load('email_links')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const link = row.getSliceValue('link')
            const campaign = row.getSliceValue('campaign')
            const metrics = this.metricsToHash(row.metrics)
            return new Link(link, campaign, metrics)
          })
        })
      )
  }

  hasNewsletter() {
    const subject = new Subject<boolean>()
    this.newsletterTotals().subscribe(totals => {
      if (totals.impressions && totals.impressions.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  newsletterTotals() {
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

  newsletterWeeklyTotals() {
    return this.dataService
      .load('newsletters_totals_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  hasSeo() {
    const subject = new Subject<boolean>()
    this.seoTotals().subscribe(totals => {
      if (totals.rankingmin && totals.rankingmin.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  seoTotals() {
    return this.dataService
      .load('localedge_seo_totals')
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

  seoMonthlyTotals() {
    return this.dataService
      .load('localedge_seo_monthly')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['rankingmin', 'reported_ranking_improvement'])
          } else {
            return []
          }
        })
      )
  }

  hasLocalEdgeWeb() {
    const subject = new Subject<boolean>()
    this.localEdgeWebTotals().subscribe(totals => {
      if (totals.pageviews && totals.pageviews.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  localEdgeWebTotals() {
    return this.dataService
      .load('localedge_web_totals')
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

  localEdgeWebWeeklyTotals() {
    return this.dataService
      .load('localedge_web_totals_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['pageviews', 'visits'])
          } else {
            return []
          }
        })
      )
  }

  displayPlatforms() {
    return this.dataService
      .load('display_devices')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const device = row.getData('device')
            const metrics = this.metricsToHash(row.metrics)
            return new Platform(device['device'], metrics)
          })
        })
      )
  }

  hasSem() {
    const subject = new Subject<boolean>()
    this.semTotals().subscribe(totals => {
      if (totals.impressions && totals.impressions.value) {
        return subject.next(true)
      } else {
        return subject.next(false)
      }
    })
    return subject
  }

  semTotals() {
    return this.dataService
      .load('sem_totals')
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

  semByWeek() {
    return this.dataService
      .load('sem_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['cost', 'clicks', 'click_rate', 'cpc'])
          } else {
            return []
          }
        })
      )
  }

  semCampaigns() {
    return this.dataService
      .load('sem_campaign')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const campaign = row.getData('campaign')
            const metrics = this.metricsToHash(row.metrics)
            return new SocialCampaign(campaign['campaign'], metrics)
          })
        })
      )
  }

  protected metricsToHash(metrics: MetricValue[]): Partial<Record<string, MetricValue>> {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric
      return memo
    }, <Partial<Record<string, MetricValue>>>{})
  }
}
