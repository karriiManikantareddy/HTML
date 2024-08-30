import {Observable, forkJoin, pipe, Subject, of} from 'rxjs'
import {catchError, shareReplay, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {Dates, TraderDataService, Metadata, LineItem, Creative, Platform, Region} from './trader-data.service'
export * from './trader-data.service'

@Injectable()
export class CampaignDataService extends TraderDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  metadata() {
    return this.campaign()
  }

  campaign() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>  {
          const row = (result && result.rows || [])[0]
          if (row) {
            const data = row.getData('campaign')
            this.updateDates(data['start_date'], data['end_date'])
            return new Metadata(data['campaign'], this.dates)
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
          const campaign = row.getData('campaign')
          const bookedImpressions = campaign['booked_impressions']
          totals['booked_impressions'] = bookedImpressions
          totals['delivered_rate'] = totals['total_line_item_level_impressions'] / bookedImpressions
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
            return result.getChartSeries(['total_line_item_level_impressions', 'click_rate'])
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
            const campaignData = row.getData('campaign')
            const metrics = this.metricsToHash(row.metrics)
            return new LineItem(id, data, campaignData['campaign'], metrics)
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

  protected metricsToHash(metrics) {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric.value
      return memo
    }, {})
  }
}
