import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

export interface LegendItem {
  name: string
  color: string
}

@Component({
  selector: 'icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() type = 'image'
  @Input() color?: string
  @Input() width?: number
  @Input() height?: number
}
