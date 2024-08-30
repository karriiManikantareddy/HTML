import { Component, HostBinding, Input, OnInit, Renderer2, ElementRef } from '@angular/core'
import { TemplateState } from '../../template.state'
import { Slide } from '../../services/template.service'

@Component({
  selector: 'slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.less'],
})
export class SlideComponent implements OnInit {
  @Input() name = ''
  @Input() enabled = false

  @Input()
  @HostBinding('class.loading')
  loading = false

  constructor(private renderer: Renderer2, private el: ElementRef, private templateState: TemplateState) {
    templateState.slides.subscribe(slides => this.onSlidesChange(slides))
  }

  ngOnInit() {
    if (!this.name) throw new Error("name is required")
    this.templateState.slideAdded()
  }

  private onSlidesChange(slides: Slide[]) {
    const slide = slides.find(s => s.name == this.name)
    if (slide == null) return
    if (slide.enabled) {
      this.renderer.removeStyle(this.el.nativeElement, 'display')
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none')
    }
  }
}
