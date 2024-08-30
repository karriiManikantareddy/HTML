import { Component, Input } from '@angular/core'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {Item} from '../../services/the-advocate-data.service'

@Component({
  selector: 'the-advocate-table',
  templateUrl: './the-advocate-table.component.html',
  styleUrls: ['./the-advocate-table.component.less']
})
export class TheAdvocateTableComponent {
  @Input() header: string
  @Input() items: Item[]
  @Input() kpis: string[]
  @Input() totals: Partial<Readonly<Record<string, MetricValue>>>
  @Input() list: string[];
  @Input() top: boolean;
  @Input() breakdown: boolean;

  formatOptions: any = {
    separatorName: 'comma',
  }
  constructor() {}

  setFormatting(format: any): any {
    return Object.merge(this.formatOptions, format)
  }
}
