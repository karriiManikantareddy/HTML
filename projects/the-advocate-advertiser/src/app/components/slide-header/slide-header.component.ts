import { Component, Input } from '@angular/core'

@Component({
  selector: 'slide-header',
  templateUrl: './slide-header.component.html',
  styleUrls: ['./slide-header.component.less']
})
export class SlideHeaderComponent {
  @Input() loading: boolean = true
  @Input() text: string
  @Input() img:boolean;
  
  logo: string = 'assets/img/LOGO-GeorgesMedia-Standard.png'

  constructor() {}
}
