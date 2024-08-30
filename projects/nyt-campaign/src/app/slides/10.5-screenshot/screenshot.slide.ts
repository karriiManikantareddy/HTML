import {Component, Input} from '@angular/core'


@Component({
  selector: 'screenshot-5',
  templateUrl: './screenshot.slide.html',
  styleUrls: ['./screenshot.slide.less']
})
export class ScreenshotsSlide5 {
  loading: boolean = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  screenshot = {
    id: 'desktop_screenshot_5',
    title_id: 'title_screenshot_5',
    class: 'desktop'
  }

  constructor() {}
  
}
