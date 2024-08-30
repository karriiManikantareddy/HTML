import {Component, Input} from '@angular/core'


@Component({
  selector: 'screenshot-1',
  templateUrl: './screenshot.slide.html',
  styleUrls: ['./screenshot.slide.less']
})
export class ScreenshotsSlide1 {
  loading: boolean = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  screenshot = {
    id: 'desktop_screenshot_1',
    title_id: 'title_screenshot_1',
    class: 'desktop'
  }

  constructor() {}
  
}
