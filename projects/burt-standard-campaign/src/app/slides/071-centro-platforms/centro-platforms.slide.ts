import {Component} from '@angular/core'
import {StandardDataService, Platform} from '../../services/standard-data.service'

@Component({
  selector: 'centro-platforms',
  templateUrl: './centro-platforms.slide.html',
  styleUrls: ['./centro-platforms.slide.less']
})
export class CentroPlatformsSlide {
  loading = true
  orderedPlatforms = ['DESKTOP', 'TABLET', 'PHONE']
  platforms: Platform[]
  shareOfTotal = {}
  metrics: any

  constructor(dataService: StandardDataService) {
    dataService
      .centroPlatforms()
      .subscribe(platforms => {
        this.loading = false
        const filteredPlatforms = (platforms || []).filter(platform => this.orderedPlatforms.includes(platform.name))
        this.metrics = filteredPlatforms.length && filteredPlatforms[0].metrics
        const sum = filteredPlatforms.map('metrics.imps_won.value').sum()
        for (const platform of filteredPlatforms) {
          const value = <number> Object.get(platform, 'metrics.imps_won.value') || 0
          this.shareOfTotal[platform.name] = value / sum
        }
        this.platforms = filteredPlatforms.sortBy('metrics.imps_won.value', true)
      })
  }

  cssClass(name: string) {
    let str = name.toLowerCase()
    if (str == 'phone') {
      str = 'mobile'
    }
    if (this.shareOfTotal[name] < 0.015) {
      str = `${str} align-right`
    }
    return str
  }

  iconClass(name: string) {
    let str = name.toLowerCase()
    if (str == 'phone') {
      str = 'mobile'
    }
    return `icon-${str}`
  }
}
