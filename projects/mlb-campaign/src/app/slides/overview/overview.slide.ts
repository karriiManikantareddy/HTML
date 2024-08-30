import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {MlbDataService, Metadata} from '../../services/mlb-data.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide {
  loading = true
  metadata?: Metadata
  totals: Partial<Readonly<Record<string, MetricValue>>>
  mlbTvTotals: Partial<Readonly<Record<string, MetricValue>>>

  constructor(dataService: MlbDataService) {
    forkJoin([dataService.metadata(), dataService.totals(), dataService.sites()])
      .subscribe(([metadata, totals, sites]) => {
        this.loading = false
        this.metadata = metadata
        this.totals = totals
        const mlbTvSite = (sites || []).find(site => site.name == 'mlb.mlb')
        if (mlbTvSite) {
          this.mlbTvTotals = mlbTvSite.metrics
        }
      })
  }
}
