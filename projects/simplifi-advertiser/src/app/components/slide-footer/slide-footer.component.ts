import { Component, Input } from '@angular/core'

@Component({
  selector: 'slide-footer',
  templateUrl: './slide-footer.component.html',
  styleUrls: ['./slide-footer.component.less']
})
export class SlideFooterComponent {
  @Input() slideName: string

  constructor() {}
}
