import {Component, Input} from '@angular/core'

@Component({
  selector: 'mobile-phone-container',
  styleUrls: ['./mobile-phone-container.component.less'],
  templateUrl: './mobile-phone-container.component.html'
})
export class MobilePhoneContainerComponent {
  @Input() slideName = ''
  src: string | null = null

  onImageLoad(src: string | null = null) {
    this.src = src
  }
}
