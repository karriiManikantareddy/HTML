import { Component, Input } from '@angular/core';
import { NytDataService, LineItem, safeDiv } from '../../services/nyt-data.service';


@Component({
  selector: 'engagements',
  templateUrl: './engagements.component.html',
  styleUrls: ['./engagements.component.less']
})
export class EngagementsComponent {
  loading = true;
  lineItemGroups: LineItem[][] = [];
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor(dataService: NytDataService) {
    dataService.lineItems().subscribe((lineItems) => {
      this.loading = false;
      this.lineItemGroups = lineItems
        .filter(li => li.metrics.dfp_video_viewership_start || li.metrics.dr_third_party_video_0)
        .sortBy(li => li.metrics.dr_third_party_interactions, true)
        .map(li => {
          const video_starts = (li.metrics.dr_third_party_video_0 || 0) + (li.metrics.dfp_video_viewership_start || 0);
          if (video_starts > 0) {
            return <LineItem>Object.merge(li, {
              metrics: Object.merge(li.metrics, {
                video_started_rate: safeDiv(video_starts, (li.metrics.dr_third_party_impressions || 0) + (li.metrics.dfp_total_line_item_level_impressions || 0)),
                video_played_25p_rate: safeDiv((li.metrics.dfp_video_viewership_first_quartile || 0) + (li.metrics.dr_third_party_video_25 || 0), video_starts),
                video_played_50p_rate: safeDiv((li.metrics.dfp_video_viewership_midpoint || 0) + (li.metrics.dr_third_party_video_50 || 0), video_starts),
                video_played_75p_rate: safeDiv((li.metrics.dfp_video_viewership_third_quartile || 0) + (li.metrics.dr_third_party_video_75 || 0), video_starts),
                video_played_fully_rate: safeDiv((li.metrics.dfp_video_viewership_complete || 0) + (li.metrics.dr_third_party_video_100 || 0), video_starts),
                video_vcr: safeDiv((li.metrics.dfp_video_viewership_complete || 0) + (li.metrics.dr_third_party_video_100 || 0), video_starts)
              })
            })
          } else {
            return li;
          }
        })
        .inGroupsOf(8)
        .map('compact')
    })
  }
}
