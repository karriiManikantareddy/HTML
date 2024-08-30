import {Component} from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'delivery-by-screen',
  templateUrl: './delivery-by-screen.slide.html',
  styleUrls: ['./delivery-by-screen.slide.less']
})
export class DeliveryByScreenSlide {
  loading = true
  hasTve = false
  devices = {
    Mobile: null,
    'DesktopsAndLaptops': null,
    Tablets: null,
    ConnectedTv: null,
    SetTopBox: null,
    Other: null
  }
  totalImpressions = 0

  constructor(dataService: CmiDataService) {
    dataService.hasTVE().subscribe(hasTve => this.hasTve = hasTve)
    dataService
      .tveDeviceName()
      .subscribe(devices => {
        if (devices) {
          devices.rows.forEach(device => {
            const type = device.getSliceId('device_name').camelize()
            const impressions = device.metrics.find((metric) => metric.name == 'impressions')
            this.devices[type] = impressions.value
            this.totalImpressions += impressions.value
          })
        }
        this.loading = false
      })
  }
}
