import {Component, ElementRef, Input} from '@angular/core'
import {debounceTime} from 'rxjs/operators'
import {FundaDataService, Metadata} from '../../services/funda-data.service'
import * as $ from 'jquery'
import {TemplateState} from 'projects/template-module/src/public_api'
import { SettingsService } from '../../services/settings.service'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  metadata: Metadata
  currentSlide: number
  templateType: string = 'consumers'

  @Input() logo: boolean = true

  constructor(private elementRef: ElementRef, templateState: TemplateState, dataService: FundaDataService, settingsService: SettingsService) {
    templateState.slides
      .pipe(debounceTime(100))
      .subscribe(slides => this.updatePageNumber())

    combineLatest<any>(
      dataService.dfpCampaign(), 
      settingsService.settingData('template-type'))
      .subscribe(([metadata, templateType]) => {
        this.metadata = metadata
        this.templateType = templateType && templateType.data
      })
  }

  private updatePageNumber() {
    const slides = $('slide').toArray()
      .filter(slide => $(slide).is(':visible'))
    const thisSlide = $(this.elementRef.nativeElement).closest('slide')[0]
    const index = slides.findIndex(thisSlide)
    this.currentSlide = index + 1
  }
}
