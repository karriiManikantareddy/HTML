import {Component} from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'search-delivery-by-screen',
  templateUrl: './search-delivery-by-screen.slide.html',
  styleUrls: ['./search-delivery-by-screen.slide.less']
})
export class SearchDeliveryByScreenSlide {
  loading = true
  hasSearch = false
  devices = {
    mobile: null,
    desktop: null,
    tablet: null,
  }
  totalImpressions = 0

  constructor(dataService: CmiDataService) {
    dataService.hasSearch().subscribe(hasSearch => this.hasSearch = hasSearch)
    dataService
      .googleAdsDevice()
      .subscribe(devices => {
        if (devices) {
          devices.rows.forEach(device => {
            const type = device.getSliceId('device')
            const impressionsIndex = device.metrics.findIndex(({ name }) => name === 'impressions')
            if (impressionsIndex !== -1) {
              const { value = 0 } = device.metrics[impressionsIndex]
              this.devices[type] = value
              this.totalImpressions += value
            }
          })
        }
        this.loading = false
      })
  }
}
