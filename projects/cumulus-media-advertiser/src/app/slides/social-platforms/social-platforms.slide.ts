import {Component} from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {CumulusMediaDataService, SocialPlatform} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'social-platforms',
  templateUrl: './social-platforms.slide.html',
  styleUrls: ['./social-platforms.slide.less']
})
export class SocialPlatformsSlide {
  loading = true
  platforms: SocialPlatform[]
  shareOfTotal = {}
  metrics: any

  constructor(dataService: CumulusMediaDataService) {
    dataService
      .socialPlatforms()
      .subscribe(platforms => {
        this.loading = false
        this.metrics = platforms.length && platforms[0].metrics
        const sum = platforms.map('metrics.impressions.value').sum()
        for (const platform of platforms) {
          const value = <number> Object.get(platform, 'metrics.impressions.value') || 0
          this.shareOfTotal[platform.name] = value / sum
        }
        this.platforms = platforms
          .filter(p => this.shareOfTotal[p.name] > 0.01)
          .sortBy('metrics.impressions.value', true)
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
