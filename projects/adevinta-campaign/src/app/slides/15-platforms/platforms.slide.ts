import { Component } from '@angular/core'
import { AdevintaDataService, Platform } from '../../services/adevinta-data.service'

@Component({
  selector: 'platforms',
  templateUrl: './platforms.slide.html',
  styleUrls: ['./platforms.slide.less']
})
export class PlatformsSlide {
  loading = true
  orderedPlatforms = ['Desktop', 'Tablet', 'Mobile']
  platforms: Platform[]
  shareOfTotal = {}
  shareOfTotalChartValue = {}

  constructor(dataService: AdevintaDataService) {
    dataService
      .platforms()
      .subscribe(platforms => {
        this.loading = false
        if (!platforms || !platforms.length) { return }
        const sum = platforms.map('metrics.gam_impressions.value').sum()
        const filteredPlatforms = (platforms || []).filter(platform => this.orderedPlatforms.includes(platform.name))
        for (const platform of filteredPlatforms) {
          const value = <number>Object.get(platform, 'metrics.gam_impressions.value') || 0
          this.shareOfTotal[platform.name] = value / sum
          this.shareOfTotalChartValue[platform.name] = Math.max(value / sum, 0.1)
        }
        this.platforms = filteredPlatforms.sortBy('metrics.gam_impressions.value', true)
      })
  }

  cssClass(name: string) {
    let str = name.toLowerCase()
    if (this.shareOfTotal[name] < 0.1) {
      str = `${str} align-right`
    }
    return str
  }

  iconUrl(name: string) {
    return `assets/img/${name.toLowerCase()}.png`
  }
}
