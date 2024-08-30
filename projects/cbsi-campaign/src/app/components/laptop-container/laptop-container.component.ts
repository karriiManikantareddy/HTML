import {Component, Input} from '@angular/core'

@Component({
  selector: 'laptop-container',
  styleUrls: ['./laptop-container.component.less'],
  templateUrl: './laptop-container.component.html'
})
export class LaptopContainerComponent {
  @Input() slideName = ''
  src: string | null = null

  onImageLoad(src: string | null = null) {
    this.src = src
  }
}
