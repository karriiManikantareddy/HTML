import {Component} from '@angular/core'
import {SimplifiDataService, Metadata} from '../../services/simplifi-data.service'

@Component({
  selector: 'recommendations',
  templateUrl: './recommendations.slide.html',
  styleUrls: ['./recommendations.slide.less']
})
export class RecommendationsSlide {
  loading = false

  constructor(dataService: SimplifiDataService) {}
}
