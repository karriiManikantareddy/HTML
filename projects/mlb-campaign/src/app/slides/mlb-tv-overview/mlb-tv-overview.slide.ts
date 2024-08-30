import { Component } from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import { MlbDataService } from '../../services/mlb-data.service'

@Component({
  selector: 'mlb-tv-overview',
  templateUrl: './mlb-tv-overview.slide.html',
  styleUrls: ['./mlb-tv-overview.slide.less']
})
export class MlbTvOverviewSlide {
  loading = true
  totals: Partial<Readonly<Record<string, MetricValue>>>

  constructor(dataService: MlbDataService) {
    dataService
      .sites()
      .subscribe(sites => {
        this.loading = false
        const mlbTvSite = (sites || []).find(site => site.name == 'mlb.mlb')
        if (mlbTvSite) {
          this.totals = mlbTvSite.metrics
        }
      })
  }
}
