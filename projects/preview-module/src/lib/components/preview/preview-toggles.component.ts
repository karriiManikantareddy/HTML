import { Component } from '@angular/core'
import { PreviewState } from '../../preview.state'
import { Slide, Toggle } from 'projects/template-module/src/public_api'

@Component({
  selector: 'preview-toggles',
  templateUrl: './preview-toggles.component.html',
  styleUrls: ['./preview-toggles.component.less']
})
export class PreviewTogglesComponent {
  slides: Slide[]

  constructor(public previewState: PreviewState) {
    previewState.slides.subscribe(slides => {
      this.slides = slides
    })
  }

  toggleSlide(slide: Slide, enable: boolean) {
    if (enable) {
      this.previewState.showSlide(slide)
    } else {
      this.previewState.hideSlide(slide)
    }
  }

  toggleSlideToggle(slide: Slide, toggle: Toggle, enable: boolean) {
    if (enable) {
      this.previewState.showSlideToggle(slide, toggle)
    } else {
      this.previewState.hideSlideToggle(slide, toggle)
    }
  }
}
