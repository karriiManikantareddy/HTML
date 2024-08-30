import {Observable, forkJoin, pipe, Subject, of} from 'rxjs'
import {catchError, shareReplay, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {CampaignDataService, Metadata} from 'projects/trader-campaign/src/app/services/campaign-data.service'

@Injectable()
export class AdvertiserDataService extends CampaignDataService {
  constructor(
    @Inject(WINDOW) window,
    dataService: DataService,
  ) {
    super(window, dataService)
  }

  metadata() {
    return this.advertiser()
  }

  advertiser() {
    return this.dataService
      .load('dfp_advertiser')
      .pipe(
        map(result =>  {
          const row = result.rows[0]
          if (row) {
            const data = row.getData('advertiser')
            return new Metadata(data['advertiser'], this.dates)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('dfp_advertiser')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (row) {
            const totals = this.metricsToHash(row.metrics)
            const advertiser = row.getData('advertiser')
            const bookedImpressions = advertiser['booked_impressions']
            totals['booked_impressions'] = bookedImpressions
            totals['delivered_rate'] = totals['impressions'] / bookedImpressions
            return totals
          }
        })
      )
  }

  series() {
    return this.dataService
      .load('dfp_advertiser_per_day')
      .pipe(
        map(result => result.getChartSeries(['total_line_item_level_impressions', 'click_rate']))
      )
  }
}
