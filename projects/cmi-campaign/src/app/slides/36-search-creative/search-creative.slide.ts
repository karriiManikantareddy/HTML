import { Component } from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'search-creative',
  templateUrl: './search-creative.slide.html',
  styleUrls: ['./search-creative.slide.less']
})
export class SearchCreativeSlide {
  loading = false
  hasSearch = false

  constructor(dataService: CmiDataService) {
    dataService.hasSearch().subscribe(hasSearch => this.hasSearch = hasSearch)
  }
}
