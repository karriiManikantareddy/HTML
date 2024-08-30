import { Component, Input } from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'simplifi-table',
  templateUrl: './simplifi-table.component.html',
  styleUrls: ['./simplifi-table.component.less']
})
export class SimplifiTableComponent {
  @Input() header: string
  @Input() items: Item[]
  @Input() kpis: string[]
  @Input() totals: Partial<Readonly<Record<string, MetricValue>>>

  formatOptions: any = {
    separatorName: 'comma',
  }
  constructor() {}

  setFormatting(format: any): any {
    return Object.merge(this.formatOptions, format)
  }
}
