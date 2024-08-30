import {Component, Input} from '@angular/core'

@Component({
  selector: 'pc-container',
  styleUrls: ['./pc-container.component.less'],
  templateUrl: './pc-container.component.html'
})
export class PCContainerComponent {
  @Input() slideName = ''
  src: string | null = null

  onImageLoad(src: string | null = null) {
    this.src = src
  }
}
