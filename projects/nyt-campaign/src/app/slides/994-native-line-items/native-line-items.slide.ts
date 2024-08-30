import {forkJoin} from 'rxjs'
import {Component, Input} from '@angular/core'
import {NytDataService, LineItem} from '../../services/nyt-data.service'
import {TemplateService} from 'projects/template-module/src/lib/services/template.service'


@Component({
  selector: 'native-line-items',
  templateUrl: './native-line-items.slide.html'
})
export class NativeLineItemsSlide {
  loading = true
  lineItemGroups: LineItem[][] = []
  dateFormat = { pattern: '{MM}/{dd}/{yy}' }
  totals: Partial<Readonly<Record<string, number>>> = {}
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(
    templateService: TemplateService,
    dataService: NytDataService
  ) {
    dataService.nativeLineItems()
      .subscribe((lineItems) => {
        this.loading = false
        this.lineItemGroups = lineItems
          .filter(li => li.metrics.dfp_total_line_item_level_impressions)
          .sortBy('startDate', true)
          .inGroupsOf(10)
          .map('compact')
      })
    dataService.nativeTotals()
      .subscribe((totals) => {
        this.totals = totals
      })
  }
}
