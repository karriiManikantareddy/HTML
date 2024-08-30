import {Component} from '@angular/core'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'youtube-keyword-breakdown',
  templateUrl: './youtube-keyword-breakdown.slide.html',
})
export class YoutubeKeywordBreakdownSlide {
  loading = true
  keywords?: Item[]
  kpis = ['impressions', 'clicks', 'ctr', 'conversions'];
  constructor(
    dataService: SimplifiDataService,
    ) {
    dataService.youtubeKeywords().subscribe(keywords => {
      this.loading = false
      this.keywords = keywords
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
    })
  }
}
