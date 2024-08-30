import {Component, ElementRef, Input} from '@angular/core'
import {NytDataService, Platform} from '../../services/nyt-data.service'
import {combineLatest} from 'rxjs'
import {NytSettingsService} from '../../services/nyt-settings.service'
import {Variables} from 'projects/template-module/src/public_api'


@Component({
  selector: 'platforms',
  templateUrl: './platforms.slide.html',
  styleUrls: ['./platforms.slide.less']
})
export class PlatformsSlide {
  loading = true
  platforms: Platform[] = []
  shareOfTotal: Partial<Record<string, number>> = {}
  colors: { desktop: string, smartphone: string, tablet: string, 'connected tv': string }
  bgcolor
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(
    dataService: NytDataService,
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
    combineLatest([dataService.platforms(), settingsService.settingData('colorTheme')]).subscribe(
      ([platforms, theme]) => {
        this.loading = false
        const filteredPlatforms = platforms.filter(platform => platform.metrics.dfp_total_line_item_level_impressions)
        const sum = filteredPlatforms.sum(p => p.metrics.dfp_total_line_item_level_impressions)
        for (const platform of filteredPlatforms) {
          this.shareOfTotal[<string> platform.name] = (platform.metrics.dfp_total_line_item_level_impressions || 0) / sum
        }
        this.platforms = filteredPlatforms.sortBy(p => p.metrics.dfp_total_line_item_level_impressions, true)

        const colors = variables.colors.themes[theme.data]
        this.colors = {
          desktop: colors.primary,
          smartphone: colors.secondary,
          tablet: colors.tertiary,
          'connected tv': colors.quaternary,
        }
      }
    )
  }
}
