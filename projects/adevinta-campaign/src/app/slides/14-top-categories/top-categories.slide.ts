import { Component } from '@angular/core'
import { AdevintaDataService, Category } from '../../services/adevinta-data.service'

@Component({
  selector: 'top-categories',
  templateUrl: './top-categories.slide.html',
  styleUrls: ['./top-categories.slide.less']
})
export class TopCategoriesSlide {
  loading = true
  caregoriesGroups: Category[][]

  constructor(dataService: AdevintaDataService) {
    dataService.categories()
      .subscribe(categories => {
        this.loading = false
        if (!categories || !categories.length) { return }
        this.caregoriesGroups = categories
          .filter((category) => {
            const metrics = category.metrics || {}
            return metrics.impressions && metrics.impressions.value > 1000 &&
              metrics.viewability && metrics.viewability.value > 0.5
          })
          .sortBy('metrics.impressions.value', true)
          .first(20)
          .inGroupsOf(10)
          .map('compact')
      })
  }
}
