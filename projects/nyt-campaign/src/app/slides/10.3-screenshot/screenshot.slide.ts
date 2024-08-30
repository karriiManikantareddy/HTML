import {Component, Input} from '@angular/core'


@Component({
  selector: 'screenshot-3',
  templateUrl: './screenshot.slide.html',
  styleUrls: ['./screenshot.slide.less']
})
export class ScreenshotsSlide3 {
  loading: boolean = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  screenshot = {
    id: 'desktop_screenshot_3',
    title_id: 'title_screenshot_3',
    class: 'desktop'
  }

  constructor() {}
  
}
