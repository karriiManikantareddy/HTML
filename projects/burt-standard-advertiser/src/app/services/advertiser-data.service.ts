import {Observable, forkJoin, pipe, Subject, of} from 'rxjs'
import {catchError, shareReplay, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {CampaignDataService, Metadata} from 'projects/burt-standard-campaign/src/app/services/campaign-data.service'

@Injectable()
export class AdvertiserDataService extends CampaignDataService {
  constructor(
    @Inject(WINDOW) window,
    dataService: DataService,
  ) {
    super(window, dataService)
  }

  metadata() {
    const subject = new Subject<Metadata>()
    forkJoin([
      this.dfpAdvertiser().pipe(catchError(() => of(null))),
      this.centroAdvertiser().pipe(catchError(() => of(null))),
    ]).subscribe(([dfpAdvertiser, centroAdvertiser]) => {
      if (dfpAdvertiser) {
        subject.next(dfpAdvertiser)
      } else {
        subject.next(centroAdvertiser)
      }
    })
    return subject
  }

  dfpAdvertiser() {
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

  centroAdvertiser() {
    return this.dataService
      .load('centro_advertiser')
      .pipe(
        map(result =>  {
          const row = result.rows[0]
          if (row) {
            const data = row.getData('brand')
            return new Metadata(data['brand'], this.dates)
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
            const bookedImpressions = Number(advertiser['booked_impressions'])
            totals['booked_impressions'] = bookedImpressions
            totals['delivered_rate'] = <number>Object.get(totals, 'total_line_item_level_impressions.value') / bookedImpressions
            return totals
          }
        })
      )
  }

  series() {
    return this.dataService
      .load('dfp_advertiser_per_day')
      .pipe(
        map(result => result.getChartSeries(['total_line_item_level_impressions', 'ctr']))
      )
  }

  centroSeries() {
    return this.dataService
      .load('centro_advertiser_per_day')
      .pipe(
        map(result => result.getChartSeries(['imps_won', 'ctr']))
      )
  }

  centroTotals() {
    return this.dataService
      .load('centro_advertiser')
      .pipe(
        map(result => {
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          const advertiser = row.getData('brand')
          const bookedImpressions = Number(advertiser['goal_value'])
          totals['booked_impressions'] = bookedImpressions
          totals['delivered_rate'] = <number>Object.get(totals, 'imps_won.value') / bookedImpressions
          return totals
        })
      )
  }
}
