import {Component, Input} from '@angular/core'


@Component({
  selector: 'screenshot-4',
  templateUrl: './screenshot.slide.html',
  styleUrls: ['./screenshot.slide.less']
})
export class ScreenshotsSlide4 {
  loading: boolean = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  screenshot = {
    id: 'desktop_screenshot_4',
    title_id: 'title_screenshot_4',
    class: 'desktop'
  }

  constructor() {}
  
}
