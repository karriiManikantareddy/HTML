import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {
  AdevintaDataService,
  Category,
  Country,
  Creative,
  CreativeSize,
  LineItem,
  Metadata,
  Platform,
  Position,
  Region,
} from './adevinta-data.service'
export * from './adevinta-data.service'

@Injectable()
export class CampaignDataService extends AdevintaDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
  ) {
    super(window)
  }

  metadata() {
    return this.mappingCampaign()
      .pipe(catchError(() => of(null)))
  }

  mappingCampaign() {
    return this.dataService
      .load('mapping_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
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
      .load('mapping_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) { return }
          const row = result.rows[0]
          if (!row) { return }
          const entity = row.getData('entity');
          return { entityCurrency: entity['mapped_currency'], metrics: this.metricsToHash(row.metrics) };
        })
      )
  }

  clickSeries() {
    return this.dataService
      .load('mapping_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['gam_impressions', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  viewabilitySeries() {
    return this.dataService
      .load('mapping_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['gam_impressions', 'gam_viewability'])
          } else {
            return []
          }
        })
      )
  }

  lineItems() {
    return this.dataService
      .load('mapping_line_items')
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
      .load('mapping_creatives')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const sliceValue = row.getSliceValue('creative')
              const id = row.getSliceId('creative')
              const data = row.getData('creative')
              const metrics = this.metricsToHash(row.metrics)
              return new Creative(sliceValue, data, metrics, id)
            })
            .filter((creative: Creative) => !!creative.name && !!creative.previewUrl)
        })
      )
  }

  creativeSizes() {
    return this.dataService
      .load('mapping_creative_sizes')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('creative_size')
            const data = row.getData('creative_size')
            const metrics = this.metricsToHash(row.metrics)
            return new CreativeSize(sliceValue, data, metrics, row.shareOfs)
          })
        })
      )

  }

  positions() {
    return this.dataService
      .load('mapping_kv')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .filter(row => {
              const data = row.getData('key')
              return data && data.key === 'pos'
            })
            .map(row => {
              const data = row.getData('value')
              const id = row.getSliceValue('value')
              const metrics = this.metricsToHash(row.metrics)
              return new Position(id, data, metrics)
            })
        })
      )
  }

  categories() {
    return this.dataService
      .load('mapping_kv')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .filter(row => {
              const data = row.getData('key')
              return data && data.key === 'ct'
            })
            .map(row => {
              const data = row.getData('value')
              const id = row.getSliceValue('value')
              const metrics = this.metricsToHash(row.metrics)
              return new Category(id, data, metrics)
            })
        })
      )
  }

  platforms() {
    return this.dataService
      .load('mapping_platforms')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('device')
              const metrics = this.metricsToHash(row.metrics)
              return new Platform(data, metrics, row.shareOfs, 'device')
            })
        })
      )
  }

  countries() {
    return this.dataService
      .load('mapping_countries')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const regionNames = (Intl as any).DisplayNames
            ? new (Intl as any).DisplayNames(['en'], {type: 'region'})
            : null
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('country')
              const name = data && data.country && regionNames
                ? regionNames.of(data.country)
                : data.country
              const code = row.getSliceValue('country')
              const metrics = this.metricsToHash(row.metrics)
              return new Country(code, name, metrics)
            })
        })
      )
  }

  regions() {
    return this.dataService
      .load('mapping_regions')
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
        })
      )
  }

  protected metricsToHash(metrics) {
    return metrics.reduce((memo, metric) => {
      const metricData = { displayName: metric.displayName, value: metric.value }
      memo[metric.name] = metricData
      return memo
    }, {})
  }
}
