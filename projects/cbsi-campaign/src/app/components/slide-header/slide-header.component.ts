import {Component, Input} from '@angular/core'

@Component({
  selector: 'slide-header',
  styleUrls: ['./slide-header.component.less'],
  templateUrl: './slide-header.component.html'
})
export class SlideHeaderComponent {
  @Input() name = ''
}
