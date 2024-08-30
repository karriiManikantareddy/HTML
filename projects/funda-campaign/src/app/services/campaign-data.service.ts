import {of, forkJoin} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {
  FundaDataService,
  Metadata,
  LineItem,
  Creative,
  Platform,
  Region,
  Domain,
  Article,
  OutboundLink,
  SalesPerson,
  Device,
} from './funda-data.service'
export * from './funda-data.service'

@Injectable()
export class CampaignDataService extends FundaDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  metadata() {
    return this.dfpCampaign()
      .pipe(catchError(() => of(null)))
      .pipe(
        map(dfpCampaign =>  {
          return dfpCampaign
        })
      )
  }

  dfpCampaign() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>  {
          const row = (result && result.rows || [])[0]
          if (row) {
            const advertiserData = row.getData('advertiser')
            const campaignData = row.getData('dfp_order')
            const salesOrder = row.getData('sales_order')
            this.updateDates(campaignData['start_date'], campaignData['end_date'])
            return new Metadata(salesOrder['sales_order'], advertiserData['advertiser'], this.dates, salesOrder['total_amount'], salesOrder)
          }
        })
      )
  }

  dfpTotals() {
    return this.dataService
      .load('dfp_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          const campaign = row.getData('dfp_order')
          const bookedImpressions = campaign['booked_impressions']
          totals['booked_impressions'] = bookedImpressions
          totals['delivered_rate'] = totals['dfp_total_line_item_level_impressions'] / bookedImpressions
          return totals
        })
      )
  }

  dfpSeries() {
    return this.dataService
      .load('dfp_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (result) {
            return result.getChartSeries(['dfp_total_line_item_level_impressions', 'ctr'])
          } else {
            return []
          }
        })
      )
  }

  dfpLineItems() {
    return this.dataService
      .load('dfp_line_items')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || []).map(row => {
            const id = row.getSliceId('dfp_line_item')
            const data = row.getData('dfp_line_item')
            const bookedImpressions = data['booked_impressions']
            const metrics = this.metricsToHash(row.metrics)
            return new LineItem(id, data['dfp_line_item'], metrics, bookedImpressions)
          })
        })
      )
  }

  dfpCreatives() {
    return this.dataService
      .load('dfp_creatives')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result =>{
          return (result && result.rows || []).map(row => {
            const sliceValue = row.getSliceValue('dfp_creative')
            const data = row.getData('dfp_creative')
            const size = row.getData('dfp_creative_size')
            const metrics = this.metricsToHash(row.metrics)
            return new Creative(sliceValue, data, metrics, size)
          })
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
              const platform = row.getSliceValue('dfp_ad_unit_4_mapped_platform')
              const metrics = this.metricsToHash(row.metrics)
              return new Platform(platform, metrics, row.shareOfs)
            })
        })
      )
  }

  dfpDomains() {
    return this.dataService
      .load('dfp_domains')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const domain = row.getSliceValue('dfp_ad_unit_4_mapped_subsite')
              const metrics = this.metricsToHash(row.metrics)
              return new Domain(domain, metrics, row.shareOfs)
            })
        })
      )
  }

  dfpRegions() {
    return this.dataService
      .load('dfp_regions')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const data = row.getData('dfp_region')
              const id = row.getSliceValue('dfp_region')
              const metrics = this.metricsToHash(row.metrics)
              return new Region(id, data, metrics)
            })
            .filter(region => region.code)
        })
      )
  }

  dfpSalesPerson() {
    return this.dataService
      .load('dfp_sales_person')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const row = (result.rows || [])[0]
          if (!row) return {}
          const name = row.getSliceValue('sales_person')
          const data = row.getData('sales_person')
          return new SalesPerson(name, data['email'], data['phone_number'])
        })
      )
  }

  gaArticles() {
    return forkJoin([
      this.dataService.load('ga_page_paths'),
      this.dataService.load('ga_outbound_links')
    ])
    .pipe(catchError(() => of(null)))
    .pipe(
      map(([pagePathsData, outboundLinksData]) => {
        const outboundLinks = (outboundLinksData && outboundLinksData.rows || [])
          .map(row => {
            const data = row.getData('outbound_link')
            const pagePath = row.getData('page_path')['page_path']
            const metrics = this.metricsToHash(row.metrics)
            return new OutboundLink(data, pagePath, metrics)
          })
          .groupBy(outboundLink => outboundLink.pagePath)
        return (pagePathsData && pagePathsData.rows || [])
          .map(row => {
            const data = row.getData('page_path')
            const metrics = this.metricsToHash(row.metrics)
            const outboundLinkClicks = outboundLinks[data['page_path']] && outboundLinks[data['page_path']].sum(outboundLink => outboundLink.metrics.clicks)
            return new Article(data, metrics, outboundLinkClicks)
          })
      })
    )
  }

  protected metricsToHash(metrics) {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric.value
      return memo
    }, {})
  }

  dfpDevice() {
    return this.dataService
      .load('dfp_device')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          return (result && result.rows || [])
            .map(row => {
              const domain = row.getSliceValue('dfp_device_category')
              const metrics = this.metricsToHash(row.metrics)
              return new Device(domain, metrics, row.shareOfs)
            })
        })
      )
  }
}
