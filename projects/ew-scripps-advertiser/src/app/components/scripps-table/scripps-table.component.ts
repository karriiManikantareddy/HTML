import { Component, Input } from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {Item} from '../../services/ew-scripps-data.service'

@Component({
  selector: 'scripps-table',
  templateUrl: './scripps-table.component.html',
  styleUrls: ['./scripps-table.component.less']
})
export class ScrippsTableComponent {
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
