import { map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { MlbDataService, Metadata, Site } from './mlb-data.service'
export * from './mlb-data.service'

@Injectable()
export class CampaignDataService extends MlbDataService {
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
            const campaignData = <any> row.getData('order')
            const advertiserData = <any> row.getData('advertiser')
            this.updateDates(campaignData.start_date, campaignData.end_date)
            return new Metadata(campaignData.order, this.dates, advertiserData.advertiser)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('campaign')
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

  sites() {
    return this.dataService
      .load('site')
      .pipe(
        map(result => {
          return (result.rows || []).map(row => {
            const siteData = <any> row.getData('ad_unit_1')
            const metrics = this.metricsToHash(row.metrics)
            return new Site(siteData.ad_unit_1, metrics)
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
