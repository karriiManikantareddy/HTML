import {Component, ElementRef} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import {NytDataService, Metadata} from '../../services/nyt-data.service'
import * as $ from 'jquery'
import {TemplateState} from 'projects/template-module/src/public_api'
import {NytSettingsService} from '../../../app/services/nyt-settings.service'
import {Variables} from 'projects/template-module/src/public_api'

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  metadata?: Metadata
  numSlides = 0
  currentSlide = 0
  bgcolor
  constructor(private elementRef: ElementRef, templateState: TemplateState, dataService: NytDataService,
    settingsService: NytSettingsService, variables: Variables) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(() => this.updatePageNumber())

    dataService
      .metadata()
      .subscribe(metadata => this.metadata = metadata)

    settingsService.settingData('backgroundcolorTheme').subscribe(
      bgtheme => {
        this.bgcolor = variables.colors.themes[bgtheme.data].primary
      })
  }

  private updatePageNumber() {
    const slides = $('slide').toArray()
      .filter((slide: HTMLElement) => $(slide).is(':visible'))
    this.numSlides = slides.length
    const thisSlide = $(this.elementRef.nativeElement).closest('slide')[0]
    const index = slides.findIndex(thisSlide)
    this.currentSlide = index + 1
  }
}
