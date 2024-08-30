import {Component} from '@angular/core'
import {StandardDataService, Platform} from '../../services/standard-data.service'

@Component({
  selector: 'platforms',
  templateUrl: './platforms.slide.html',
  styleUrls: ['./platforms.slide.less']
})
export class PlatformsSlide {
  loading = true
  orderedPlatforms = ['Desktop', 'Tablet', 'Smartphone']
  platforms: Platform[]
  shareOfTotal = {}
  metrics: any

  constructor(dataService: StandardDataService) {
    dataService
      .platforms()
      .subscribe(platforms => {
        this.loading = false
        const filteredPlatforms = (platforms || []).filter(platform => this.orderedPlatforms.includes(platform.name))
        this.metrics = filteredPlatforms.length && filteredPlatforms[0].metrics
        const sum = filteredPlatforms.map('metrics.total_line_item_level_impressions.value').sum()
        for (const platform of filteredPlatforms) {
          const value = <number> Object.get(platform, 'metrics.total_line_item_level_impressions.value') || 0
          this.shareOfTotal[platform.name] = value / sum
        }
        this.platforms = filteredPlatforms.sortBy('metrics.total_line_item_level_impressions.value', true)
      })
  }

  cssClass(name: string) {
    let str = name.toLowerCase()
    if (this.shareOfTotal[name] < 0.015) {
      str = `${str} align-right`
    }
    return str
  }

  iconUrl(name: string) {
    return `assets/img/${name.toLowerCase()}.png`
  }
}
