import { Component, Input } from '@angular/core'
import {NytDataService, Metadata, PaidPost} from '../../services/nyt-data.service'
import {Variables} from 'projects/template-module/src/lib/variables'
import { forkJoin } from 'rxjs';


@Component({
  selector: 'native-content',
  templateUrl: './native-content.slide.html',
  styleUrls: ['./native-content.slide.less']

})
export class NativeContentSlide {
  loading = true
  totals: Partial<Record<string, number>> = {}
  paidPosts: PaidPost[] = []
  totalPVs: number = 0
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor(dataService: NytDataService, variables: Variables) {
    forkJoin([
      dataService.nativeTotals(),
      dataService.paidPosts(),
    ])
    .subscribe(([nativeTotals, paidPosts]) => {
      this.loading = false
      this.totals = nativeTotals
      this.paidPosts = paidPosts.sortBy(pp => pp.metrics.ga_pageviews, true).slice(0, 2)
      this.totalPVs = paidPosts.sum(pp => pp.metrics.ga_pageviews || 0)
    })
  }
}
