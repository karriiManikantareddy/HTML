import {Component} from '@angular/core'
import {StandardDataService, CreativeSize} from '../../services/standard-data.service'

@Component({
  selector: 'creative-sizes',
  templateUrl: './creative-sizes.slide.html'
})
export class CreativeSizesSlide {
  loading = true
  creativeSizeGroups: CreativeSize[][]

  constructor(dataService: StandardDataService) {
    dataService.creativeSizes().subscribe(creativeSizes => {
      this.loading = false
      this.creativeSizeGroups = creativeSizes
        .sortBy('shareOfs.total_line_item_level_impressions', true)
        .inGroupsOf(5)
        .map('compact')
    })
  }
}
