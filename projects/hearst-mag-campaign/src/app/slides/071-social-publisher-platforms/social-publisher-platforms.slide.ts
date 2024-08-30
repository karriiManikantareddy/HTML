import {Component} from '@angular/core'
import {HearstMagazinesDataService, SocialPublisherPlatform} from '../../services/hearst-magazines-data.service'

@Component({
  selector: 'social-publisher-platforms',
  templateUrl: './social-publisher-platforms.slide.html',
  styleUrls: ['./social-publisher-platforms.slide.less']
})
export class SocialPublisherPlatformsSlide {
  loading = true
  platforms: SocialPublisherPlatform[]
  shareOfTotal = {}
  metrics: any

  constructor(dataService: HearstMagazinesDataService) {
    dataService
      .socialPublisherPlatform()
      .subscribe(platforms => {
        this.loading = false
        this.metrics = platforms.length && platforms[0].metrics
        const sum = platforms.map('metrics.impressions.value').sum()
        for (const platform of platforms) {
          const value = <number> Object.get(platform, 'metrics.impressions.value') || 0
          this.shareOfTotal[platform.name] = value / sum
        }
        this.platforms = platforms.sortBy('metrics.impressions.value', true)
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
