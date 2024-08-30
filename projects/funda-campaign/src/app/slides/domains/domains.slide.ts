import {Component} from '@angular/core'
import {FundaDataService, Domain} from '../../services/funda-data.service'

@Component({
  selector: 'domains',
  templateUrl: './domains.slide.html',
  styleUrls: ['./domains.slide.less']
})
export class DomainsSlide {
  loading = true
  domains: Domain[]
  shareOfTotal = {}

  constructor(dataService: FundaDataService) {
    dataService
      .dfpDomains().subscribe(domains => {
        this.loading = false
        if (!domains) return
        const sum = domains.map('metrics.dfp_total_line_item_level_impressions').sum()
        for (const domain of domains) {
          const value = <number> Object.get(domain, 'metrics.dfp_total_line_item_level_impressions') || 0
          this.shareOfTotal[domain.name] = value / sum
        }
        this.domains = domains.sortBy('metrics.dfp_total_line_item_level_impressions', true)
      })
  }

  cssClass(i: number, name: string) {
    let str = `subsite-${i}`
    if (this.shareOfTotal[name.toLowerCase()] < 0.015) {
      str = `${str} align-right`
    }
    return str
  }
}
