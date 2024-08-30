import {Component, Input, ElementRef} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import * as $ from 'jquery'
import {TemplateState} from 'projects/template-module/src/public_api'
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
  @Input() name: string
  numSlides: number
  currentSlide: number

  constructor(private elementRef: ElementRef, templateState: TemplateState) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(slides => this.updatePageNumber())
  }

  private updatePageNumber() {
    const slides = $('slide').toArray()
      .filter(slide => $(slide).is(':visible'))
    this.numSlides = slides.length
    const thisSlide = $(this.elementRef.nativeElement).closest('slide')[0]
    const index = slides.findIndex(thisSlide)
    this.currentSlide = index + 1
  }
}
