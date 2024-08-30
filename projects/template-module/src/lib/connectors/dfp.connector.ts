import {Observable, forkJoin, pipe} from 'rxjs'
import {catchError, shareReplay, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from '../services/data.service'
import {Metadata, LineItem, Creative, CreativeSize, Platform, Region, DayOfWeek, Hour} from './models'
import {ChartSeries, MetricValue} from '../services/result.model';

@Injectable({
  providedIn: 'root'
})
export class DfpConnector {
  constructor(private dataService: DataService) {}

  campaignMetadata() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(
        map(result =>  {
          const row = result.rows[0]
          return new Metadata(row.getData('order'))
        })
      )
  }

  campaignTotals() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(
        map(result => {
          const row = result.rows[0]
          const totals = this.metricsToHash(row.metrics)
          const campaign = <any> row.getData('order')
          const bookedImpressions = <number> campaign.booked_impressions
          totals['booked_impressions'] = bookedImpressions
          if (bookedImpressions) {
            totals['delivered_rate'] = (totals['total_line_item_level_impressions'] || 0) / bookedImpressions
          }
          return totals
        })
      )
  }

  campaignSeries(): Observable<ChartSeries[]> {
    return this.dataService
      .load('dfp_campaign_per_day')
      .pipe(
        map(result => result.getChartSeries(['total_line_item_level_impressions', 'ctr']))
      )
  }

  lineItems() {
    return this.dataService
      .load('dfp_line_items')
      .pipe(
        map(result => {
          return result.rows.map(row => {
            const data = <any> row.getData('line_item')
            const metrics = this.metricsToHash(row.metrics)
            return new LineItem(data['line_item'], metrics)
          })
        })
      )
  }

  creatives() {
    return this.dataService
      .load('dfp_creatives')
      .pipe(
        map(result =>{
          return result.rows.map(row => {
            const data = row.getData('creative')
            const metrics = this.metricsToHash(row.metrics)
            return new Creative(data, metrics)
          })
        })
      )
  }

  creativeSizes() {
    return this.dataService
      .load('dfp_creative_sizes')
      .pipe(
        map(result =>{
          return result.rows.map(row => {
            const data = row.getData('creative_size')
            const metrics = this.metricsToHash(row.metrics)
            return new CreativeSize(data, metrics, row.shareOfs)
          })
        })
      )

  }

  platforms() {
    return this.dataService
      .load('dfp_platforms')
      .pipe(
        map(result => {
          return result.rows
            .map(row => {
              const data = row.getData('device_category')
              const metrics = this.metricsToHash(row.metrics)
              return new Platform(data, metrics, row.shareOfs)
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
      .pipe(
        map(result => {
          return result.rows
            .map(row => {
              const data = row.getData('region')
              const metrics = this.metricsToHash(row.metrics)
              return new Region(data, metrics)
            })
            .filter(region => region.code)
        })
      )
  }

  dayOfWeek() {
    return this.dataService
      .load('dfp_day_of_week')
      .pipe(
        map(result => {
          return result.rows
            .map(row => {
              const data = row.getData('day')
              const metrics = this.metricsToHash(row.metrics)
              return new DayOfWeek(data, metrics)
            })
            .sortBy('index')
        })
      )
  }

  hours() {
    return this.dataService
      .load('dfp_hour')
      .pipe(
        map(result => {
          return result.rows
            .map(row => {
              const data = row.getData('hour')
              const metrics = this.metricsToHash(row.metrics)
              return new Hour(data, metrics)
            })
            .filter(h => h.hour != -1)
            .sortBy(h => h.hour)
        })
      )
  }

  private metricsToHash(metrics: MetricValue[]): Partial<Record<string, number>> {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric.value
      return memo
    }, <Partial<Record<string, number>>> {})
  }
}
