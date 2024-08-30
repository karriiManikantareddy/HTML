import {Component, ElementRef} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import {StandardDataService, Metadata} from '../../services/standard-data.service'
import * as $ from 'jquery'
import {TemplateState} from 'projects/template-module/src/public_api'

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  metadata: Metadata
  numSlides: number
  currentSlide: number

  constructor(private elementRef: ElementRef, templateState: TemplateState, dataService: StandardDataService) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(slides => this.updatePageNumber())

    dataService
      .metadata()
      .subscribe(metadata => this.metadata = metadata)
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
