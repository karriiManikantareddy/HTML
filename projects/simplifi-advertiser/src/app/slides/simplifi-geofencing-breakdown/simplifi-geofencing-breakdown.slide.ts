import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'

@Component({
  selector: 'simplifi-geofencing-breakdown',
  templateUrl: './simplifi-geofencing-breakdown.slide.html',
})
export class SimplifiGeofencingBreakdownSlide {
  loading = true
  geoFences?: Item[]
  kpis = ['total_visits']

  constructor(dataService: SimplifiDataService) {
    dataService.simplifiGeofencingBreakdownItems().subscribe((geoFences) => {
      this.loading = false
      this.geoFences = geoFences
        .filter(geoFence => geoFence.name !== 'Unknown' && geoFence.name !== 'None')
        .sortBy(c => -c.metrics.total_visits.value)
        .slice(0, 10)
    })
  }
}
