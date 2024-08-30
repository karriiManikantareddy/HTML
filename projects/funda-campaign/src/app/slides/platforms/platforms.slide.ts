import {Component} from '@angular/core'
import {FundaDataService, Platform} from '../../services/funda-data.service'

@Component({
  selector: 'platforms',
  templateUrl: './platforms.slide.html',
  styleUrls: ['./platforms.slide.less']
})
export class PlatformsSlide {
  loading = true
  platforms: Platform[]
  chartPlatforms: Platform[] = []
  shareOfTotal = {}

  constructor(dataService: FundaDataService) {
    dataService
      .dfpPlatforms()
      .subscribe(platforms => {
        this.loading = false
        const sum = platforms.map('metrics.dfp_total_line_item_level_impressions').sum()
        for (const platform of platforms) {
          const value = <number> Object.get(platform, 'metrics.dfp_total_line_item_level_impressions') || 0
          if (value / sum >= 0.01) {
            this.chartPlatforms.push(platform)
            this.shareOfTotal[platform.name] = value / sum            
          }
        }
        this.chartPlatforms = this.chartPlatforms.sortBy('metrics.dfp_total_line_item_level_impressions', true)
        this.platforms = platforms.sortBy('metrics.dfp_total_line_item_level_impressions', true)
      })
  }

  cssClass(i: number, name: string) {
    let str = `platform-${i}`
    if (this.shareOfTotal[name.toLowerCase()] < 0.015) {
      str = `${str} align-right`
    }
    return str
  }
}
