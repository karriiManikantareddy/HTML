import { Component, Input } from '@angular/core'

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent {
  @Input() loading: boolean = true
  @Input() text: string

  constructor() {}
}
