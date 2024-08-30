import { Component, Input } from '@angular/core'


@Component({
  selector: 'thank-you',
  templateUrl: './thank-you.slide.html',
  styleUrls: ['./thank-you.slide.less']

})
export class ThankYouSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
}
