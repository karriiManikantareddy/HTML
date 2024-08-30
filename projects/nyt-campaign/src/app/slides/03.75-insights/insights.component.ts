import { Component, Input} from '@angular/core';


@Component({
  selector: 'insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.less']
})
export class InsightsComponent {
  loading = false;
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  constructor() { }

}
