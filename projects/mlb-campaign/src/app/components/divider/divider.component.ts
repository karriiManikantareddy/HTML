import { Component, Input } from '@angular/core'

@Component({
  selector: 'divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.less']
})
export class DividerComponent {
  @Input() loading: boolean = true
  @Input() name: string
  @Input() hideLogo: boolean = false

  constructor() {}
}
