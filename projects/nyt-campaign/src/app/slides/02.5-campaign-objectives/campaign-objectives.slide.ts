import {Component, Input} from '@angular/core'

@Component({
  selector: 'campaign-objectives',
  templateUrl: './campaign-objectives.slide.html',
  styleUrls: ['./campaign-objectives.slide.less']
})
export class CampaignObjectivesSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor() { }

}
