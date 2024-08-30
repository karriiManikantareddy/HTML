import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {StandardDataService, DfpCreative} from '../../services/standard-data.service'

@Component({
  selector: 'top-creatives',
  templateUrl: './top-creatives.slide.html',
  styleUrls: ['./top-creatives.slide.less']
})
export class TopCreativesSlide {
  loading = true
  topCreatives: DfpCreative[]
  totalMetrics = {}

  constructor(dataService :StandardDataService){
    combineLatest([
      dataService.dfpCreatives(),
      dataService.dfpTotals()
    ])
    .subscribe(([creatives, totals]) => {
      this.loading = false
      this.totalMetrics = {total_line_item_level_impressions: totals && totals['total_line_item_level_impressions'], total_line_item_level_clicks: totals && totals['total_line_item_level_clicks']}
      this.topCreatives = creatives && creatives
        .sortBy('metrics.total_line_item_level_impressions', true)
        .slice(0, 2)
        .compact()
    })
  }
}
