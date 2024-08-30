import {Component, Input} from '@angular/core'


@Component({
  selector: 'screenshot-2',
  templateUrl: './screenshot.slide.html',
  styleUrls: ['./screenshot.slide.less']
})
export class ScreenshotsSlide2 {
  loading: boolean = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  screenshot = {
    id: 'desktop_screenshot_2',
    title_id: 'title_screenshot_2',
    class: 'desktop'
  }

  constructor() {} 
  
}
