import {forkJoin, Subject, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {StandardDataService, Metadata, LineItem, Creative, CreativeSize, Platform, Region} from './standard-data.service'
export * from './standard-data.service'

@Injectable()
export class CampaignDataService extends StandardDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  metadata() {
    const subject = new Subject<Metadata>()
    forkJoin([
      this.dfpCampaign().pipe(catchError(() => of(null))),
      this.centroCampaign().pipe(catchError(() => of(null))),
    ]).subscribe(([dfpCampaign, centroCampaign]) => {
      if (dfpCampaign) {
        subject.next(dfpCampaign)
      } else {
        subject.next(centroCampaign)
      }
    })
    return subject
  }

  dfpCampaign() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>  {
          const row = (result && result.rows || [])[0]
          if (row) {
            const data = row.getData('order')
            this.updateDates(data['start_date'], data['end_date'])
            return new Metadata(data['order'], this.dates)
          }
        })
      )
  }

  centroCampaign() {
    return this.dataService
      .load('centro_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>  {
          const row = result.rows[0]
          if (row) {
            const data = row.getData('campaign_group')
            this.updateDates(data['start_date'], data['end_date'])
            return new Metadata(data['campaign_group'], this.dates)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          const campaign = row.getData('order')
          if (campaign['booked_impressions']) {
            const bookedImpressions = Number(campaign['booked_impressions'])
            totals['booked_impressions'] = bookedImpressions
            totals['delivered_rate'] = <number>Object.get(totals, 'total_line_item_level_impressions.value') / bookedImpressions
          }
          return totals
        })
      )
  }

  centroSeries() {
    return this.dataService
      .load('centro_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['imps_won', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  centroTotals() {
    return this.dataService
      .load('centro_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          const campaign = row.getData('campaign_group')
          const bookedImpressions = Number(campaign['goal_value'])
          totals['booked_impressions'] = bookedImpressions
          totals['delivered_rate'] = <number>Object.get(totals, 'imps_won.value') / bookedImpressions
          return totals
        })
      )
  }

  series() {
    return this.dataService
      .load('dfp_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['total_line_item_level_impressions', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  lineItems() {
    return this.dataService
      .load('dfp_line_items')
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

  centroLineItems() {
    return this.dataService
      .load('centro_line_items')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const id = row.getSliceId('campaign')
            const data = row.getData('campaign')
            const metrics = this.metricsToHash(row.metrics)
            return new LineItem(id, data['campaign'], metrics)
          })
        })
      )
  }

  creatives() {
    return this.dataService
      .load('dfp_creatives')
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

  centroCreatives() {
    return this.dataService
      .load('centro_creatives')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>{
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('creative')
            const data = row.getData('creative')
            if (/^http:/.test(data.preview_url)) {
              data.preview_url = data.preview_url.replace('http://preview.sitescout.ad', 'https://preview.pixel.ad')
            }
            const metrics = this.metricsToHash(row.metrics)
            return new Creative(sliceValue, data, metrics)
          })
        })
      )
  }

  creativeSizes() {
    return this.dataService
      .load('dfp_creative_sizes')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>{
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('creative_size')
            const data = row.getData('creative_size')
            const metrics = this.metricsToHash(row.metrics)
            return new CreativeSize(sliceValue, data, metrics, row.shareOfs)
          })
        })
      )

  }

  platforms() {
    return this.dataService
      .load('dfp_platforms')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('device_category')
              const metrics = this.metricsToHash(row.metrics)
              return new Platform(data, metrics, row.shareOfs, 'device_category')
            })
            .filter(platform => {
              return ['Desktop', 'Smartphone', 'Tablet'].includes(platform.name)
            })
        })
      )
  }

  centroPlatforms() {
    return this.dataService
      .load('centro_platforms')
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
              return ['DESKTOP', 'PHONE', 'TABLET'].includes(platform.name)
            })
        })
      )
  }

  regions() {
    return this.dataService
      .load('dfp_regions')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('region')
              const id = row.getSliceValue('region')
              const metrics = this.metricsToHash(row.metrics)
              return new Region(id, data, metrics)
            })
            .filter(region => region.code)
        })
      )
  }

  centroRegions() {
    return this.dataService
      .load('centro_regions')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('region')
              const id = row.getSliceValue('region')
              const metrics = this.metricsToHash(row.metrics)
              return new Region(id, data, metrics)
            })
            .filter(region => region.code)
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
