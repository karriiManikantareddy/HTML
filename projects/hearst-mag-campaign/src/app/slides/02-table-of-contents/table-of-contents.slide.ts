import {Component, ElementRef} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import * as $ from 'jquery'
import {TemplateState} from 'projects/template-module/src/public_api'

@Component({
  selector: 'table-of-contents',
  templateUrl: './table-of-contents.slide.html',
  styleUrls: ['./table-of-contents.slide.less']
})
export class TableOfContentsSlide {
  loading = true
  entries: any[]
  templateConfigs: any

  constructor(
    private elementRef: ElementRef, 
    templateState: TemplateState, 
  ) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(slides => {
        this.loading = false
        const enabledSlides = this.extractEnabledSlides(slides)
        this.updateToc(enabledSlides)
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
}
