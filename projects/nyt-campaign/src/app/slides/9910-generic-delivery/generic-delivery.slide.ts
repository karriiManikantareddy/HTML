import {Component, Input} from '@angular/core'
import { NytDataService, Creative } from '../../services/nyt-data.service'


@Component({
  selector: 'generic-delivery',
  templateUrl: './generic-delivery.slide.html',
  styleUrls: ['./generic-delivery.slide.less'],
})
export class GenericDeliverySlide {
  loading = false
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
}
