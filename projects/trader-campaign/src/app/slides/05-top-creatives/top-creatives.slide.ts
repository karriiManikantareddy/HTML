import {Component} from '@angular/core'
import {TraderDataService, Creative} from '../../services/trader-data.service'

@Component({
  selector: 'top-creatives',
  templateUrl: './top-creatives.slide.html',
  styleUrls: ['./top-creatives.slide.less']
})
export class TopCreativesSlide {
  loading = true
  creativeGroups: Creative[][]
  totalMetrics = {}

  constructor(dataService: TraderDataService) {
    dataService.creatives().subscribe(creatives => {
      this.loading = false
      this.totalMetrics['total_line_item_level_impressions'] = creatives.map('metrics.total_line_item_level_impressions').sum()
      this.totalMetrics['total_line_item_level_clicks'] = creatives.map('metrics.total_line_item_level_clicks').sum()

      this.creativeGroups = creatives
        .sortBy('metrics.total_line_item_level_impressions', true)
        .filter(creative => !creative.width || creative.width > 1)
        .slice(0, 4)
        .inGroupsOf(2)
        .map('compact')
    })
  }
}
