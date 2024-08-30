import {Component, Input} from '@angular/core'
import {NytDataService, Creative} from '../../services/nyt-data.service'


@Component({
  selector: 'native-content-top-creatives',
  templateUrl: './native-content-top-creatives.slide.html',
  styleUrls: ['./native-content-top-creatives.slide.less']
})
export class NativeContentTopCreativesSlide {
  loading: boolean = true
  topCreatives: Creative[][] = []
  totalMetrics: any = {}
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(dataService: NytDataService) {
    dataService.nativeCreatives().subscribe(creatives => {
      this.loading = false
      this.totalMetrics.dfp_total_line_item_level_impressions = creatives.sum(c => c.metrics.dfp_total_line_item_level_impressions || 0)
      this.totalMetrics.dfp_total_line_item_level_clicks = creatives.sum(c => c.metrics.dfp_total_line_item_level_clicks || 0)

      this.topCreatives = Object.values<Creative[]>(creatives.groupBy(creative => creative.lineItemName))
        .map(creatives => creatives.sortBy(creative => creative.metrics.dfp_ctr, true).first())
        .inGroupsOf(2)
        .map('compact')
    })
  }
}
