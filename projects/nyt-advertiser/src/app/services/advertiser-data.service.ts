import {forkJoin, ReplaySubject} from 'rxjs'
import {map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {
  CampaignDataService,
  Metadata,
  DfpCreative,
  LineItem
} from 'projects/nyt-campaign/src/app/services/campaign-data.service'
import {safeDiv} from 'projects/nyt-campaign/src/app/services/nyt-data.service'

@Injectable()
export class AdvertiserDataService extends CampaignDataService {
  constructor(
    @Inject(WINDOW) window: Window,
    dataService: DataService,
  ) {
    super(window, dataService)
  }

  metadata() {
    return this.dataService
      .load('metadata')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const data = <any> row.getData('advertiser')
            return new Metadata(data.advertiser, this.dates)
          }
        })
      )
  }

  totals() {
    const subject = new ReplaySubject<any>()
    forkJoin([
      this.dataService.load('advertiser'),
      this.dataService.load('campaign'),
    ]).subscribe(([advertiser, campaigns]) => {
      const row = advertiser.rows[0]
      if (row) {
        const totals = this.metricsToHash(row.metrics)
        const bookedImpressions = (campaigns.rows || []).sum(campaign => {
          const campaignData = <any> campaign.getData('campaign')
          return campaignData.booked_impressions || 0
        })
        totals.booked_impressions = bookedImpressions
        totals.delivered_rate = safeDiv(totals.dfp_total_line_item_level_impressions, bookedImpressions)
        subject.next(totals)
      } else {
        subject.next({})
      }
      subject.complete()
    })
    return subject
  }

  series() {
    return this.dataService
      .load('advertiser_per_day')
      .pipe(
        map(result => result.getChartSeries(['dfp_total_line_item_level_impressions', 'dfp_ctr']))
      )
  }

  nativeSeries() {
    return this.dataService
      .load('native_advertiser_per_day')
      .pipe(
        map(result => result.getChartSeries(['dfp_total_line_item_level_impressions', 'dfp_ctr', 'ga_pageviews']))
      )
  }

  nativeTotals() {
    const subject = new ReplaySubject<any>()
    forkJoin([
      this.dataService.load('native_advertiser'),
      this.dataService.load('native_campaign'),
    ]).subscribe(([advertiser, campaign]) => {
      const row = advertiser.rows[0]
      if (row) {
        const totals = this.metricsToHash(row.metrics)
        const bookedImpressions = (campaign.rows || []).sum(campaign => (<any> campaign.getData('campaign')).booked_impressions || 0)
        totals.booked_impressions = bookedImpressions
        totals.delivered_rate = safeDiv(totals.dfp_total_line_item_level_impressions, bookedImpressions)
        subject.next(totals)
      } else {
        subject.next({})
      }
      subject.complete()
    })
    return subject
  }
}
