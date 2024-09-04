import { Component } from '@angular/core';

@Component({
  selector: 'campaign-highlights',
  templateUrl: './campaign-highlights.component.html',
  styleUrl: './campaign-highlights.component.less'
})
export class CampaignHighlightsComponent {
  headerContent: string = 'Campaign <span class="highlight">&nbsp;Highlights</span>';
  greyBox: boolean = true;
}
