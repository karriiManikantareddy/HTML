import {Component} from '@angular/core'
import {isNil} from 'lodash'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'cpa-display-performance',
  templateUrl: './cpa-display-performance.slide.html',
  styleUrls: ['./cpa-display-performance.slide.less']
})
export class CpaDisplayPerformanceSlide {
  loading = true
  hasAed = false
  creatives = []
  maxNameLength = 18
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'cpa', name_1: 'Cost Per Action', format: 'number', description: 'No. of actions / campaign ad spend'}
  ]
  footerMetrics = [
    {metric: 'sales', name_1: 'Sales', description: 'No. of purchases after seeing your ad', classes: ['extra', 'border']},
    {metric: 'leads', name_1: 'Leads', format: 'number', description: 'No. of times someone opted in', classes: ['extra']},
    {metric: 'sign_ups', name_1: 'Sign-ups', format: 'number', description: 'No. of times someone filled out a form', classes: ['extra']},
    {metric: 'page_view_count', name_1: 'Total Page View Count', format: 'number', description: 'No. of times someone viewed your desired page', classes: ['extra']}
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasAED().subscribe(hasAed => this.hasAed = hasAed)
    dataService
      .mappedDisplaySimplifiCreative()
      .subscribe(creative => {
        if (creative) {
          this.creatives = creative.rows
            .map(row => ({
              id: row.getSliceId('creative'),
              name: row.getData('creative').creative,
              metrics: row.metrics.reduce((acc, {name: n, value: v}) => {
                acc[n] = v
                return acc
              }, {})
            }))
            .filter(row => !isNil(row.metrics.cpa))
            .sort((a, b) => b.metrics.cpa - a.metrics.cpa || (b.name > a.name ? 0 : -1))
            .splice(0, 3)
            .reverse()
            .map(row => {
              row.metrics.sales = row.metrics.clickthrough_sales + row.metrics.viewthrough_sales
              row.metrics.leads = row.metrics.clickthrough_leads + row.metrics.viewthrough_leads
              row.metrics.sign_ups = row.metrics.clickthrough_signups + row.metrics.viewthrough_signups
              row.metrics.page_view_count = row.metrics.clickthrough_total + row.metrics.viewthrough_totals
              return row
            })
        }
        this.loading = false
      })
  }
}
