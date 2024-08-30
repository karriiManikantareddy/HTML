import { Component, Input } from '@angular/core'


@Component({
  selector: 'insights-recommendations',
  templateUrl: './insights-recommendations.slide.html',
  styleUrls: ['./insights-recommendations.slide.less']
})
export class InsightsRecommendationsSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  constructor() {}
}
