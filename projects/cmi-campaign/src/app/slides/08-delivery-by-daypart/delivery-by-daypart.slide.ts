import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'delivery-by-daypart',
  templateUrl: './delivery-by-daypart.slide.html',
  styleUrls: ['./delivery-by-daypart.slide.less']
})
export class DeliveryByDaypartSlide {
  loading = true
  hasTve = false
  daypartOrder = {
    '6a - 9a': 0,
    '9a - 4p': 0,
    '4p - 8p': 0,
    '8p - 11p': 0,
    '11p - 6a': 0
  }
  totalImpressions = 0
  networks = []

  constructor(dataService: CmiDataService) {
    dataService.hasTVE().subscribe(hasTve => this.hasTve = hasTve)
    combineLatest([dataService.tveDaypart(), dataService.tveSites()])
      .subscribe(([daypartData, networksData]) => {
        if (daypartData) {
          daypartData.rows
            .forEach(row => {
              const key = row.getData('daypart').daypart
              const impressions = row.getMetricValue('impressions') || 0
              this.daypartOrder[key] += impressions
              this.totalImpressions += impressions
            })
        }
        if (networksData) {
        this.networks = networksData
          .sort((a, b) => {
            let metric = 'impressions'
            if (a.getMetricValue('impressions')) {
              metric = 'impressions'
            } else if (a.getMetricValue('_active_view_eligible_impressions')) {
              metric = '_active_view_eligible_impressions'
            } else if (a.getMetricValue('net_delivered_impressions')) {
              metric = 'net_delivered_impressions'
            }
            return b.getMetricValue(metric) - a.getMetricValue(metric);
          })
          .map(row => {
            let siteName: string
            if (row.hasSlice('site')) {
              siteName = row.getSliceValue('site')
            } else if (row.hasSlice('_domain')) {
              siteName = row.getSliceValue('_domain')
            } else if(row.hasSlice('site_section')) {
              siteName = row.getSliceValue('site_section')
            } else {
              siteName = row.getSliceValue('domain')
            }
            return siteName
          })
          .slice(0, 15)
        }
        this.loading = false
      })
  }

  objectKeys(obj: {}) {
    return Object.keys(obj);
  }
}
