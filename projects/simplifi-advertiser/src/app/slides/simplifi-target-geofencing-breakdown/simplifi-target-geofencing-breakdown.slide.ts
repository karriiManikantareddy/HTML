import {Component} from '@angular/core'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'simplifi-target-geofencing-breakdown',
  templateUrl: './simplifi-target-geofencing-breakdown.slide.html',
})
export class SimplifiTargetGeofencingBreakdownSlide {
  loading = true
  geoFences?: Item[]
  kpis = ['total_visits']

  constructor(dataService: SimplifiDataService) {
    dataService.simplifiTargetGeofencingBreakdownItems().subscribe((geoFences) => {
      this.loading = false
      this.geoFences = geoFences
        .filter(geoFence => geoFence.name !== 'Unknown')
        .sortBy(c => -c.metrics.total_visits.value)
        .slice(0, 10)
    })
  }
}
