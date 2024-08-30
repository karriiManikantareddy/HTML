import {forkJoin, Subject, of} from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { CumulusMediaDataService, Metadata, SocialCampaign, SocialAd, SocialPlatform, WebsiteDevice, WebsiteGender, WebsiteAge, GamAd, CentroAd} from './cumulus-media-data.service'
export * from './cumulus-media-data.service'

@Injectable()
export class AdvertiserDataService extends CumulusMediaDataService {
  constructor(
    @Inject(WINDOW) window: Window,
    protected dataService: DataService,
  ) {
    super(window)
  }

  metadata() {
    const subject = new Subject<Metadata>()
    forkJoin([
      this.socialAdvertiser().pipe(catchError(() => of(null))),
      this.websiteAdvertiser().pipe(catchError(() => of(null))),
    ]).subscribe(([socialAdvertiser, websiteAdvertiser]) => {
      if (socialAdvertiser) {
        subject.next(socialAdvertiser)
      } else {
        subject.next(websiteAdvertiser)
      }
    })
    return subject
  }

  socialAdvertiser() {
    return this.dataService
      .load('metadata')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiserName = <any> row.getSliceId('mapped_advertiser')
            return new Metadata(advertiserName, this.dates, advertiserName)
          }
        })
      )
  }

  websiteAdvertiser() {
    return this.dataService
      .load('website_metadata')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const advertiserName = <any> row.getSliceId('mapped_advertiser')
            return new Metadata(advertiserName, this.dates, advertiserName)
          }
        })
      )
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
            return result.getChartSeries(['impressions', 'link_clicks', 'link_click_ctr', 'cpc'])
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
          return new SocialAd(ad, metrics)
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
          const publisher_platform = row.getData('publisher_platform')
          const metrics = this.metricsToHash(row.metrics)
          return new SocialPlatform(publisher_platform['publisher_platform'], metrics)
        })
      })
    )
  }

  websiteTotals() {
    return this.dataService
      .load('website_totals')
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

  websiteByWeek() {
    return this.dataService
      .load('website_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['users', 'time_on_page', 'pageviews'])
          } else {
            return []
          }
        })
      )
  }

  websiteGenders() {
    return this.dataService
    .load('website_gender')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const gender = row.getData('gender')
          const metrics = this.metricsToHash(row.metrics)
          return new WebsiteGender(gender['gender'], metrics)
        })
      })
    )
  }

  websiteDevices() {
    return this.dataService
    .load('website_device')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const device_category = row.getData('device_category')
          const metrics = this.metricsToHash(row.metrics)
          return new WebsiteDevice(device_category['device_category'], metrics)
        })
      })
    )
  }

  websiteAges() {
    return this.dataService
    .load('website_age')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const age = row.getData('age')
          const metrics = this.metricsToHash(row.metrics)
          return new WebsiteAge(age['age'], metrics)
        })
      })
    )
  }

  gamTotals() {
    return this.dataService
      .load('gam_totals')
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

  gamAdvertiserByWeek() {
    return this.dataService
      .load('gam_advertiser_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['total_line_item_level_impressions', 'total_line_item_level_clicks', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  gamAds() {
    return this.dataService
    .load('gam_ad')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new GamAd(ad, metrics)
        })
      })
    )
  }

  centroTotals() {
    return this.dataService
      .load('centro_totals')
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

  centroAdvertiserByWeek() {
    return this.dataService
      .load('centro_advertiser_by_week')
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'ctr', 'total_conversions'])
          } else {
            return []
          }
        })
      )
  }

  centroAds() {
    return this.dataService
    .load('centro_ad')
    .pipe(
      map(result => {
        return (result && result.rows || []).map(row => {
          const ad = row.getData('creative')
          const metrics = this.metricsToHash(row.metrics)
          return new CentroAd(ad, metrics)
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
