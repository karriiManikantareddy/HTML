import {Component, Input} from '@angular/core'


@Component({
  selector: 'screenshot-boxes',
  templateUrl: './screenshot-boxes.slide.html',
  styleUrls: ['./screenshot-boxes.slide.less']
})
export class ScreenshotBoxes {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor() {}
  
}
