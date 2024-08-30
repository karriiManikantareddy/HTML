import { Observable, Subject, BehaviorSubject, combineLatest, pipe } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Injectable, ElementRef } from '@angular/core'
import { PostMessageService, Slide, Template, Toggle } from 'projects/template-module/src/public_api'

@Injectable()
export class PreviewState {
  frame: HTMLIFrameElement
  slides = new BehaviorSubject<Slide[]>([])
  windowResized$ = new Subject<boolean>()

  constructor(private postMessageService: PostMessageService) {
    postMessageService.addListener('slidesUpdated', this.slidesUpdated.bind(this))

    this.windowResized$
      .pipe(debounceTime(100))
      .subscribe(() => {
        postMessageService.send(this.frame.contentWindow, 'window-resized')
      })
  }

  setFrame(frame: ElementRef) {
    this.frame = frame.nativeElement
  }

  slidesUpdated(template: Template) {
    this.slides.next(template.slides)
  }

  showSlide(slide: Slide) {
    this.updateSlide(slide, {enabled: true})
  }

  hideSlide(slide: Slide) {
    this.updateSlide(slide, {enabled: false})
  }

  showSlideToggle(slide: Slide, toggle: Toggle) {
    this.updateSlideToggle(slide, toggle, {enabled: true})
  }

  hideSlideToggle(slide: Slide, toggle: Toggle) {
    this.updateSlideToggle(slide, toggle, {enabled: false})
  }

  windowResized() {
    this.windowResized$.next(true)
  }

  private updateSlide(slide: Slide, attributes: any) {
    this.sendMessage('updateSlide', Object.add(slide, attributes))
  }

  private updateSlideToggle(slide: Slide, toggle: Toggle, attributes: any) {
    const toggles = slide.toggles
    const index = toggles.findIndex(t => t.name == toggle.name)
    const newToggles = [
      ...toggles.slice(0, index),
      Object.add(toggle, attributes),
      ...toggles.slice(index + 1)
    ]
    this.updateSlide(slide, {toggles: newToggles})
  }

  private sendMessage(eventName, data) {
    this.postMessageService.send(this.frame.contentWindow, eventName, data)
  }
}
