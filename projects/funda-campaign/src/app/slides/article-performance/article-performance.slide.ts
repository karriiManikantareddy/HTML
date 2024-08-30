import {Component} from '@angular/core'
import {FundaDataService, Article} from '../../services/funda-data.service'

@Component({
  selector: 'article-performance',
  templateUrl: './article-performance.slide.html',
  styleUrls: ['./article-performance.slide.less']
})
export class ArticlePerformanceSlide {
  loading = true
  articleGroups: Article[][]

  constructor(dataService: FundaDataService) {
    dataService.gaArticles().subscribe(articles => {
      this.loading = false
      this.articleGroups = articles
        .sortBy('metrics.pageviews', true)
        .inGroupsOf(10)
        .map('compact')
    })
  }
}
