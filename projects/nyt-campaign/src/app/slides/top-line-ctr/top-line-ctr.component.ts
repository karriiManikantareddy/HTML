import { Component, OnDestroy, Input} from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { NytDataService } from '../../services/nyt-data.service';
import { NytSettingsService } from '../../services/nyt-settings.service';


@Component({
  selector: 'top-line-ctr',
  templateUrl: './top-line-ctr.component.html',
  styleUrls: ['./top-line-ctr.component.less']
})
export class TopLineCtrComponent implements OnDestroy {
  totals: any;
  loading = true;
  subscription: Subscription;
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(dataService: NytDataService) {
    this.subscription = combineLatest([dataService.lineItems()])
      .subscribe(([lineItems]) => {
        this.loading = false;
        this.totals = lineItems
          .filter(li => li.metrics.dfp_total_line_item_level_impressions)
          .sortBy(li => li.metrics['dfp_ctr'], true)
          .slice(0, 1)[0];
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
