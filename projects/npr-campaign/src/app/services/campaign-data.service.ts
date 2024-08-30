import {of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import {WINDOW} from 'projects/template-module/src/lib/window.module'
import {NprDataService, Metadata, Creative, Product, Platform, Region, Benchmark} from './npr-data.service'
export * from './npr-data.service'

@Injectable()
export class CampaignDataService extends NprDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  cfrCampaign() {
    return this.dataService
    .load('cfr_campaign')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result =>  {
        const row = (result && result.rows || [])[0]
        if (row) {
          const campaignData = row.getData('io')
          const accountData = row.getData('account')
          const dealData = row.getData('deal')
          const source = row.getSliceValue('source')
          this.updateDates(campaignData['start_date'], campaignData['end_date'])
          return new Metadata(campaignData['io'], accountData['account'], this.dates, dealData['account_manager'], source)
        }
      })
    )
  }

  totals() {
    return this.dataService
    .load('cfr_campaign')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result => {
        if (!result) return
        const row = result.rows[0]
        if (!row) return
        return this.metricsToHash(row.metrics)
      })
    )
  }
  
  creatives() {
    return this.dataService
    .load('cfr_creatives')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result =>{
        return (result && result.rows || []).map(row => {
          const sliceValue = row.getSliceValue('creative')
          return new Creative(sliceValue)
        })
      })
    )
  }

  creativeSeries() {
    return this.dataService
    .load('cfr_creative_per_day')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result => {
        if (result) {
          return result && result.getChartSeries(['creative','impressions'])
        } else {
          return []
        }
      })
    )
  }
    
  products() {
    return this.dataService
    .load('cfr_products')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result =>{
        return (result && result.rows || [])
        .map(row => {
          const data = row.getData('product')
          if (!data['podcast_show']) return
          const metrics = this.metricsToHash(row.metrics)
          return new Product(data, metrics, row.shareOfs)
        })
        .filter(row => row.name != undefined && !row.name.includes("Run of"))
      })
    )
  }

  productsByAge() {
    return this.dataService
    .load('cfr_products_by_age')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result =>{
        return (result && result.rows || [])
        .map(row => {
          const sliceValue = row.getSliceValue('product')
          const data = row.getData('product')
          const metrics = this.metricsToHash(row.metrics)
          if (row.getSliceValue('age') == "n/a") return
          const age = row.getSliceValue('age')
          return new Benchmark(sliceValue, data, metrics, age)
        })
        .filter(row => row != undefined && !row.podcastShow.includes("Run of"))
      })
    )
  }

  platforms() {
    return this.dataService
    .load('cfr_platforms')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result => {
        return (result && result.rows || [])
        .map(row => {
          if (row.getSliceValue('device').toString() == "OTHERS") return
          const data = row.getSliceValue('device')
          const metrics = this.metricsToHash(row.metrics)
          return new Platform(data, metrics)
        })
        .filter(row => row != undefined)
      })
    )
  }

  regions() {
    return this.dataService
    .load('cfr_regions')
    .pipe(catchError(() => of(null)))
    .pipe(
      map(result => {
        return (result && result.rows || [])
          .map(row => {
            if (row.getSliceValue('dma') == "n/a") return
            const id = row.getSliceValue('dma')
            const metrics = this.metricsToHash(row.metrics)
            return new Region(id, metrics)
          })
          .filter(row => row != undefined)
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