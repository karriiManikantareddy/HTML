import {forkJoin, Subject, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {HearstMagazinesDataService, Metadata, LineItem, Creative, Platform, Region, SocialCreative, SocialPublisherPlatform, Gender, Age} from './hearst-magazines-data.service'
export * from './hearst-magazines-data.service'

@Injectable()
export class CampaignDataService extends HearstMagazinesDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  metadata() {
    const subject = new Subject<Metadata>()
    forkJoin([
      this.campaign().pipe(catchError(() => of(null))),
    ]).subscribe(([campaign]) => {
      subject.next(campaign)
    })
    return subject
  }

  campaign() {
    return this.dataService
      .load('campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>  {
          const row = (result && result.rows || [])[0]
          if (row) {
            const campaign = row.getSliceValue('mapped_campaign')
            return new Metadata(campaign, this.dates)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          return totals
        })
      )
  }

  socialTotals() {
    return this.dataService
      .load('social_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          return totals
        })
      )
  }

  series() {
    return this.dataService
      .load('campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['third_party_impressions', 'first_party_impressions'])
          } else {
            return []
          }
        })
      )
  }

  lineItems() {
    return this.dataService
      .load('line_items')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const id = row.getSliceId('line_item')
            const data = row.getData('line_item')
            const metrics = this.metricsToHash(row.metrics)
            return new LineItem(id, data['line_item'], metrics)
          })
        })
      )
  }

  creatives() {
    return this.dataService
      .load('creatives')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>{
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('creative')
            const data = row.getData('creative')
            const metrics = this.metricsToHash(row.metrics)
            return new Creative(sliceValue, data, metrics)
          })
        })
      )
  }

  socialCreatives() {
    return this.dataService
      .load('social_ad')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>{
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('ad')
            const data = row.getData('ad')
            const metrics = this.metricsToHash(row.metrics)
            return new SocialCreative(sliceValue, data, metrics)
          })
        })
      )
  }

  socialPublisherPlatform() {
    return this.dataService
      .load('social_publisher_platform')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>{
          return (result && result.rows || []).map(row => {
            const data = row.getData('publisher_platform')
            const metrics = this.metricsToHash(row.metrics)
            return new SocialPublisherPlatform(data['publisher_platform'], metrics, row.shareOfs)
          })
        })
      )
  }

  platforms() {
    return this.dataService
      .load('platforms')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('device_type')
              const metrics = this.metricsToHash(row.metrics)
              return new Platform(data, metrics, row.shareOfs, 'device_type')
            })
            .filter(platform => {
              return ['Desktop', 'Smartphone', 'Tablet'].includes(platform.name)
            })
        })
      )
  }

  brandedContentTotals() {
    return this.dataService
      .load('branded_content_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          return totals
        })
      )
  }

  brandedContentSeries() {
    return this.dataService
      .load('branded_content_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['users', 'pageviews'])
          } else {
            return []
          }
        })
      )
  }

  protected metricsToHash(metrics) {
    return metrics.reduce((memo, metric) => {
      const metricData = {displayName: metric.displayName, value: metric.value}
      memo[metric.name] = metricData
      return memo
    }, {})
  }
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
