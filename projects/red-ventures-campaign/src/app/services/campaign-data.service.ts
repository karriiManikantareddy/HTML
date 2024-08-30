import { Observable, forkJoin, pipe, ReplaySubject, of } from 'rxjs'
import { catchError, shareReplay, map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { Row } from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {
  RedVenturesDataService,
  Metadata,
} from './red-ventures-data.service'
export * from './red-ventures-data.service'

@Injectable()
export class CampaignDataService extends RedVenturesDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  metadata() {
    return this.dataService
    .load('campaign')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result =>  {
        const row = result && result.rows[0]
        if (row) {
          return new Metadata(row.getData('campaign'), row.getData('advertiser'))
        }
      })
    )
  }

  totals() {
    return this.dataService
    .load('campaign')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(data => {
        if (data && data.rows.length) {
          return this.metricsToHash(data.rows[0].metrics)
        }
      })
    )
  }

  series() {
    return this.dataService
    .load('campaign_by_day')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(data => {
        return data && data.getChartSeries(['billable_impressions', '1p_ctr'])
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
