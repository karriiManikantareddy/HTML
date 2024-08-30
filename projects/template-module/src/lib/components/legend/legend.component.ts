import { Component, OnChanges, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core'

export interface LegendItem {
  name: string
  color: string
}

@Component({
  selector: 'legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent {
  @Input() items: LegendItem[] = []
  @Input() type: string ='pie';

}
