import {Component, Input} from '@angular/core'

@Component({
  selector: 'header-logo',
  templateUrl: './header-logo.component.html',
  styles: [`
  .logo {
    position: absolute;
    right: 50px;
    max-height: 100px;
  }
`],
})
export class HeaderLogoComponent {
  @Input() white: boolean = false

  constructor() {}
}
