import { Component, Input } from '@angular/core'


@Component({
  selector: 'screenshot-mobiles',
  templateUrl: './screenshot-mobiles.slide.html',
  styleUrls: ['./screenshot-mobiles.slide.less'],
})
export class ScreenshotMobiles {
  loading = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  screenshots = [
    {
      id: 'mobiles_screenshot_1',
      title_id: 'title_screenshot_5',
    },
    {
      id: 'mobiles_screenshot_2',
      title_id: 'title_screenshot_5',
    },
    {
      id: 'mobiles_screenshot_3',
      title_id: 'title_screenshot_5',
    },
  ]

  constructor() {}
  
}
