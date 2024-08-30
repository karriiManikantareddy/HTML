import {Observable, forkJoin, pipe, Subject, of} from 'rxjs'
import {catchError, shareReplay, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {CampaignDataService, Metadata} from 'projects/mlb-campaign/src/app/services/campaign-data.service'

@Injectable()
export class AdvertiserDataService extends CampaignDataService {
  constructor(
    @Inject(WINDOW) window,
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
            const advertiserData = <any> row.getData('advertiser')
            return new Metadata(advertiserData.advertiser, this.dates, advertiserData.advertiser)
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('advertiser')
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
}