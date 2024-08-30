import {map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import {MetricValue} from 'projects/template-module/src/lib/services/result.model'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { DfpCreative, FbCreative, LineItem, Metadata, NytDataService, PaidPost, Platform, Region, Benchmark, Country, Section, Subsection } from './nyt-data.service'
import { combineLatest } from 'rxjs'
export * from './nyt-data.service'

@Injectable()
export class CampaignDataService extends NytDataService {
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
            const campaignData = <any> row.getData('campaign')
            const advertiserData = <any> row.getData('advertiser')
            this.updateDates(campaignData.start_date, campaignData.end_date)
            return new Metadata(campaignData.campaign, this.dates, advertiserData.advertiser)
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
            const totals = this.metricsToHash(row.metrics)
            const data = <any> row.getData('campaign')
            const bookedImpressions = data.booked_impressions
            totals.booked_impressions = bookedImpressions
            if (bookedImpressions) {
              totals.delivered_rate = (totals.dfp_total_line_item_level_impressions || 0) / bookedImpressions
            }
            return totals
          } else {
            return {}
          }
        })
      )
  }

  nativeTotals() {
    return this.dataService
      .load('native_campaign')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const totals = this.metricsToHash(row.metrics)
            const data = <any> row.getData('campaign')
            const bookedImpressions = data.booked_impressions
            totals.booked_impressions = bookedImpressions
            if (bookedImpressions) {
              totals.delivered_rate = (totals.dfp_total_line_item_level_impressions || 0) / bookedImpressions
            }
            return totals
          } else {
            return {}
          }
        })
      )
  }

  paidPosts() {
    return this.dataService
      .load('paid_post')
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const data = row.getData('ga_paid_post_parameter')
            const metrics = this.metricsToHash(row.metrics)
            return new PaidPost(data, metrics)
          })
        })
      )
  }

  series() {
    return this.dataService
      .load('campaign_per_day')
      .pipe(
        map(result => result.getChartSeries(['dfp_total_line_item_level_impressions', 'dfp_ctr']))
      )
  }

  nativeSeries() {
    return this.dataService
      .load('native_campaign_per_day')
      .pipe(
        map(result => result.getChartSeries(['dfp_total_line_item_level_impressions', 'dfp_ctr', 'ga_pageviews']))
      )
  }

  lineItems() {
    return this.dataService
      .load('line_items')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const id = row.getSliceId('line_item')
              const data = row.getData('line_item')
              const metrics = this.metricsToHash(row.metrics)
              return new LineItem(id, data, metrics)
            })
        })
      )
  }

  nonDFPLineItems() {
    return this.lineItems()
      .pipe(
        map(lineItems => lineItems.filter(lineItem => lineItem.name && !lineItem.metrics.dfp_total_line_item_level_impressions))
      )
  }

  nativeNonDFPLineItems() {
    return this.nativeLineItems()
      .pipe(
        map(lineItems => lineItems.filter(lineItem => lineItem.name && !lineItem.metrics.dfp_total_line_item_level_impressions))
      )
  }

  nativeLineItems() {
    return this.dataService
      .load('native_line_items')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('line_item')
              const id = row.getSliceId('line_item')
              const metrics = this.metricsToHash(row.metrics)
              return new LineItem(id, data, metrics)
            })
        })
      )
  }

  creatives() {
    return this.dataService
      .load('creatives')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const id = row.getSliceId('creative')
              const creativeData = row.getData('creative')
              const lineItemData = row.getData('line_item')
              const metrics = this.metricsToHash(row.metrics)
              return new DfpCreative(id, creativeData, metrics, lineItemData)
            })
        })
      )
  }

  nativeCreatives() {
    return this.dataService
      .load('native_creatives')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const lineItemData = row.getData('line_item')
              const id = row.getSliceId('creative')
              const metrics = this.metricsToHash(row.metrics)
              if (row.getSliceValue('fb_ad')) {
                const data = row.getData('fb_ad')
                return new FbCreative(data, metrics, lineItemData)
              } else {
                const data = row.getData('creative')
                return new DfpCreative(id, data, metrics, lineItemData)
              }
            })
        })
      )
  }

  platforms() {
    return this.dataService
      .load('platforms')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('dfp_device_category')
              const metrics = this.metricsToHash(row.metrics)
              return new Platform(data, metrics, row.shareOfs)
            })
            .filter(platform => {
              return platform.name && ['Desktop', 'Smartphone', 'Tablet', 'Connected TV'].includes(platform.name)
            })
        })
      )
  }

  regions() {
    return this.dataService
      .load('regions')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('dfp_region')
              const metrics = this.metricsToHash(row.metrics)
              return new Region(data, metrics)
            })
            .filter(region => region.code)
        })
      )
  }

  regions_by_country() {
    return this.dataService
      .load('regions_by_country')
      .pipe(
        map(result => {
          let countries = {};
          (result && result.rows || [])
            .map(row => {
              const countryData = row.getData('dfp_country')
              const regionData = row.getData('dfp_region')
              const metrics = this.metricsToHash(row.metrics)
              const region = new Region(regionData, metrics)
              if (region.code && region.code !== '??') {
                if (countries[countryData.dfp_country]) {
                  countries[countryData.dfp_country].push(region)
                } else {
                  countries[countryData.dfp_country] = [region]
                }
              }
            })
            return countries
        })
      )
  }

  countries() {
    return this.dataService
      .load('countries')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('dfp_country')
              const metrics = this.metricsToHash(row.metrics)
              return new Country(data, metrics)
            })
        })
      )
  }

  sections() {
    return this.dataService
      .load('sections')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('dfp_ad_unit_2')
              const metrics = this.metricsToHash(row.metrics)
              return new Section(data, metrics)
            })
        })
      )
  }

  subsections() {
    return this.dataService
      .load('subsections')
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('dfp_ad_unit_3')
              const metrics = this.metricsToHash(row.metrics)
              return new Subsection(data, metrics)
            })
        })
      )
  }

  benchmarks() {
    return this.dataService
      .load('benchmarks', {interval: '19700101-19700101'})
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const benchmarkData = row.getData('order')
              const campaign = row.getData('campaign')
              return new Benchmark(benchmarkData, campaign)
            })
        })
      )
  }

  public benchmarksFiltered() {
    return combineLatest([
      this.metadata(),
      this.benchmarks()
    ]).pipe(
      map(([metadata, benchmarks]) => {
        const startDate = metadata && Date.create(metadata.startDate)
        const endDate = metadata && Date.create(metadata.endDate)
        let selectedBenchmark = benchmarks && benchmarks[0];
        let overlappingDays = 0;

        if (benchmarks && benchmarks.length > 1) {
          let campaignWithMostOverlappingDays: string;

          if (metadata && startDate && endDate) {
            benchmarks.forEach((benchmark) => {
              const currentOverlappingDays = Math.max(endDate.daysSince(benchmark.startDate), 0);
              if (
                benchmark.startDate >= startDate &&
                benchmark.startDate <= endDate &&
                currentOverlappingDays >= overlappingDays
              ) {
                overlappingDays = currentOverlappingDays;
                campaignWithMostOverlappingDays = benchmark.campaignName;
              }
            })
          }
          if (!!campaignWithMostOverlappingDays) {
            selectedBenchmark = benchmarks.find(b => b.campaignName === campaignWithMostOverlappingDays);
          }
        }

        return selectedBenchmark;
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
