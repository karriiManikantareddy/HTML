import {of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import {WINDOW} from 'projects/template-module/src/lib/window.module'
import {StandardDataService, DfpCreative, DfpPlatform, GaAdvertiser, DfpContentAction} from './standard-data.service'
import {MetricValue} from 'projects/template-module/src/lib/services/result.model'
export * from './standard-data.service'

@Injectable()
export class CampaignDataService extends StandardDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  dfpTotals() {
    return this.dataService
      .load('dfp_advertiser')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const row = result && result.rows && result.rows[0]
          if (!row) return
          const metrics = this.metricsToHash(row.metrics)
          return metrics
        })
      )
  }

  dfpSeries() {
    return this.dataService
      .load('dfp_advertiser_per_day')
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

  dfpPlatforms() {
    return this.dataService
      .load('dfp_platforms')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('device_category')
              const metrics = this.metricsToHash(row.metrics)
              return new DfpPlatform(data, metrics, row.shareOfs, 'device_category')
            })
            .filter(platform => {
              return ['desktop', 'smartphone', 'tablet'].includes(platform.name.toLowerCase())
            })
        })
      )
  }

  dfpContentAction() {
    return this.dataService
      .load('dfp_content_action')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const data = row.getData('line_item_content_action')
            const metrics = this.metricsToHash(row.metrics)
            return new DfpContentAction(data, metrics)
          })
        })
      )
  }

  fbTotals() {
    return this.dataService
      .load('fb_advertiser')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const row = result && result.rows && result.rows[0]
          if (!row) return
          return this.metricsToHash(row.metrics)
        })
      )
  }

  fbSeries() {
    return this.dataService
      .load('fb_advertiser_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['impressions', 'vcr'])
          } else {
            return []
          }
        })
      )
  }

  dfpCreatives() {
    return this.dataService
      .load('dfp_creatives')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('creative')
            const data = row.getData('creative')
            const metrics = this.metricsToHash(row.metrics)
            return new DfpCreative(sliceValue, data, metrics)
          })
        })
      )
  }

  gaAdvertiser() {
    return this.dataService
      .load('ga_advertiser')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>  {
          const row = result && result.rows[0]
          if (row) {
            const data = row.getData('advertiser')
            const metrics = this.metricsToHash(row.metrics)
            return new GaAdvertiser(data, metrics)
          }
      })
    )
  }

  protected metricsToHash(metrics: MetricValue[]): Partial<Record<string, number>> {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric.value
      return memo
    }, <Partial<Record<string, number>>> {})
  }
}

