import {Component, Input} from '@angular/core'

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.less']
})
export class FooterComponent {
  @Input() isWhite: boolean
  
  constructor() {}
}
