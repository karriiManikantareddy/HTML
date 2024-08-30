import { Component } from '@angular/core'
import { Variables } from 'projects/template-module/src/lib/variables'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'branded-content-article-breakdown',
  templateUrl: './branded-content-article-breakdown.slide.html',
})
export class BrandedContentArticleBreakdownSlide {
  loading: boolean = true
  articleGroups?: Item[][]
  kpis: string[] = ['article_page_views', 'total_time_in_view', 'article_ad_clicks', 'article_ad_impressions']

  constructor(dataService: TheAdvocateDataService, variables: Variables) {
    dataService.brandedContentArticleBreakdownItems().subscribe(articles => {
      this.loading = false
      this.articleGroups = articles
        .sortBy(c => -c.metrics.impressions.value)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
