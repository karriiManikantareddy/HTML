import { BehaviorSubject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Injectable, Inject, EventEmitter } from '@angular/core'
import { PostMessageService } from './services/post-message.service'
import { WINDOW } from './window.module'
import * as $ from 'jquery'
import { TemplateService, Slide, Toggle } from './services/template.service'

@Injectable({
  providedIn: 'root'
})
export class TemplateState {
  private slideChanges: Record<string, Slide> = {}
  private onSlideAdded = new EventEmitter()
  slides = new BehaviorSubject<Slide[]>([])

  constructor(
    @Inject(WINDOW) private window: Window,
    private postMessageService: PostMessageService,
    private templateService: TemplateService
  ) {
    this.onSlideAdded
      .pipe(debounceTime(100))
      .subscribe(() => {
        const slides = this.templateService.getUniqueSlides()
        this.slidesUpdated(this.mergeWithChanges(slides))
      })

    postMessageService.addListener('updateSlide', this.updateSlide.bind(this))
    postMessageService.addListener('window-resized', this.zoomContent.bind(this))

    const params = <any> Object.fromQueryString(window.location.search)
    if (params.export_id) {
      this.setChangesFromExportState()
    }
  }

  private slidesUpdated(slides: Slide[]) {
    this.postMessageService.send(window.top, 'slidesUpdated', <any>{ slides: slides })
    this.slides.next(slides)
  }

  private setChangesFromExportState() {
    this.templateService.getExportState().subscribe(state => {
      const slides = state && state.slides || []

      const slideChanges: Record<string, Slide> = {}
      for (const slide of slides.compact()) {
        slideChanges[slide.name] = slide
      }
      this.slideChanges = slideChanges

      this.slidesUpdated(this.mergeWithChanges(this.slides.getValue()))
    })
  }

  private updateSlide(newSlide?: Slide) {
    if (!newSlide) return

    this.slideChanges[newSlide.name] = newSlide
    this.slidesUpdated(this.mergeWithChanges(this.slides.getValue()))
  }

  private mergeWithChanges(slides: Slide[]): Slide[] {
    return slides.map(slide => {
      const slideChange = this.slideChanges[slide.name]
      if (slideChange) {
        const togglesFromChanges: Record<string, Toggle> = {}
        for (const toggle of slideChange.toggles || []) {
          togglesFromChanges[toggle.name] = toggle
        }
        const newToggles = slide.toggles.map(toggle => Object.add(toggle, togglesFromChanges[toggle.name]) as Toggle)

        return <Slide> Object.addAll(slide, [slideChange, {toggles: newToggles}])
      } else {
        return slide
      }
    })
  }

  slideAdded() {
    this.onSlideAdded.emit()
  }

  zoomContent() {
    const document = this.window.document
    const bodyWidth = document.body.clientWidth
    const slides = document.getElementsByTagName('slide')
    if (slides.length == 0) return
    const slidesWidth = ($(slides[0]).width() || 0) + 20 // + right margin
    if (slidesWidth > bodyWidth) {
      const factor = bodyWidth / slidesWidth
      const scaledHeight = document.body.clientHeight * factor
      $(document.body).css({
        '-moz-transform':           `scale(${factor})`,
        '-moz-transform-origin':    '0 0',
        '-o-transform':             `scale(${factor})`,
        '-o-transform-origin':      '0 0',
        '-webkit-transform':        `scale(${factor})`,
        '-webkit-transform-origin': '0 0',
        '-ms-transform':            `scale(${factor})`,
        '-ms-transform-origin':     '0 0',
        'transform':                `scale(${factor})`,
        'transform-origin':         '0 0',
        'margin':                   '0 10px',
        'height':                   `${scaledHeight}px`,
      })
    }
  }
}
