import { Directive, Input, OnInit, Renderer2, ElementRef } from '@angular/core'
import { TemplateState } from '../../template.state'
import { Slide } from '../../services/template.service'
import * as $ from 'jquery'

@Directive({
  selector: '[toggle]'
})
export class ToggleDirective implements OnInit {
  @Input() name = ''
  @Input() enabled = false

  constructor(private renderer: Renderer2, private el: ElementRef<HTMLElement>, private templateState: TemplateState) {
    templateState.slides.subscribe(slides => this.onSlidesChange(slides))
  }

  ngOnInit() {
    if (!this.name) throw new Error("name is required")
  }

  private onSlidesChange(slides: Slide[]) {
    const $slide = $(this.el.nativeElement).closest('slide')
    const slide = slides.find(slide => slide.name == $slide.attr('name'))
    if (slide) {
      const $toggle = $(this.el.nativeElement)
      const toggle = slide.toggles.find(toggle => toggle.name == $toggle.attr('name'))
      if (toggle && toggle.enabled) {
        this.renderer.removeStyle(this.el.nativeElement, 'display')
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none')
      }
    }
  }
}
