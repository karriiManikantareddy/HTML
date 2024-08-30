import {Component, ElementRef} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import * as $ from 'jquery'
import {TemplateState, Slide} from 'projects/template-module/src/public_api'

interface Entry {
  name: string,
  page: number
}

@Component({
  selector: 'table-of-contents',
  templateUrl: './table-of-contents.slide.html',
  styleUrls: ['./table-of-contents.slide.less']
})
export class TableOfContentsSlide {
  loading = true
  entryGroups: Entry[][] = []

  constructor(private elementRef: ElementRef, templateState: TemplateState) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(slides => {
        this.loading = false
        const enabledSlides = this.extractEnabledSlides(slides)
        this.updateToc(enabledSlides)
      })
  }

  private updateToc(enabledSlides: Partial<Record<string, boolean>>) {
    const slides = $('slide').toArray()
    const thisSlide = $(this.elementRef.nativeElement).find('slide')[0]
    const index = slides.findIndex(thisSlide)
    const slidesAfterToc = slides.slice(index + 1)
    this.entryGroups = this.parseTocEntries(enabledSlides, slidesAfterToc, index).inGroupsOf(20).map('compact')
  }

  private parseTocEntries(enabledSlides: Partial<Record<string, boolean>>, slides: HTMLElement[], index: number) {
    let currentName: string
    const entries: Entry[] = []
    let page = index + 1
    slides.forEach(slide => {
      const name = $(slide).attr('name')
      if (name && enabledSlides[name]) {
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

  public trackBySlides(index, slide) {
    if (!slide) {
      return null;
    }

    return index;
  }

  private extractEnabledSlides(slides: Slide[]): Partial<Record<string, boolean>> {
    return slides.reduce((memo, slide) => {
      if (slide.enabled) {
        memo[slide.name] = true
      }
      return memo
    }, <Partial<Record<string, boolean>>> {})
  }
}
