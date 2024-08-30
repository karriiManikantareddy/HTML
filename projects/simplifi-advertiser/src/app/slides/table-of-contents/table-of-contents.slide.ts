import {Component, ElementRef} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import * as $ from 'jquery'
import {TemplateState} from 'projects/template-module/src/public_api'
import { TemplateConfigService } from '../../services/template-config.service'
import {Variables} from 'projects/template-module/src/lib/variables'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'
import {SimplifiDataService, Metadata} from '../../services/simplifi-data.service'

@Component({
  selector: 'table-of-contents',
  templateUrl: './table-of-contents.slide.html',
  styleUrls: ['./table-of-contents.slide.less']
})
export class TableOfContentsSlide {
  loading = true
  entries: any[]
  templateConfigs: any
  theme: string = 'dark'
  background: string
  textColor: string
  metadata?: Metadata
  currentDate: Date = new Date()
  dateOptions: any = {pattern:  '{M}.{d}.{year}'}

  constructor(
    private elementRef: ElementRef, 
    templateState: TemplateState, 
    templateConfigService: TemplateConfigService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
    dataService: SimplifiDataService,
  ) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(slides => {
        this.loading = false
        const enabledSlides = this.extractEnabledSlides(slides)
        this.updateToc(enabledSlides)
      })

    templateConfigService.getTemplateConfigs().subscribe(templateConfigs => {
      this.templateConfigs = templateConfigs
    })

    dataService
      .metadata()
      .subscribe(metadata => {
        this.metadata = metadata
      })

    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
      this.background = variables.colors[this.theme].backgroundCover
      this.textColor = variables.colors[this.theme].coverText
    })
  }

  private updateToc(enabledSlides) {
    const slides = $('slide').toArray()
    const thisSlide = $(this.elementRef.nativeElement).find('slide')[0]
    const index = slides.findIndex(thisSlide)
    const slidesAfterToc = slides.slice(index + 1)
    this.entries = this.parseTocEntries(enabledSlides, slidesAfterToc, index)
  }

  private parseTocEntries(enabledSlides, slides, index) {
    let currentName
    const entries = []
    let page = index + 1
    slides.forEach(slide => {
      const name = $(slide).attr('name')
      if (enabledSlides[name]) {
        page ++
        const hideFromToc = $(slide).attr('hideFromToc')
        if (hideFromToc == null) {
          if (name != currentName) {
            entries.push({name: name, page: page})
            currentName = name
          }
        }
      }
    })
    return entries
  }

  private extractEnabledSlides(slides) {
    return slides.reduce((memo, slide) => {
      if (slide.enabled) {
        memo[slide.name] = true
      }
      return memo
    }, {})
  }

  splitPages(entries: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < entries?.length; i += size) {
      result.push(entries.slice(i, i + size));
    }
    return result;
  }
}
