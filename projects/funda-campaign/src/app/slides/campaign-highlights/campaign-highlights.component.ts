import { Component } from '@angular/core';

@Component({
  selector: 'app-campaign-highlights',
  templateUrl: './campaign-highlights.component.html',
  styleUrl: './campaign-highlights.component.css'
})
export class CampaignHighlightsComponent {
  headerContent: string = 'Campaign <span class="highlight">&nbsp;Highlights</span>';
  greyBox: boolean = true;
}
