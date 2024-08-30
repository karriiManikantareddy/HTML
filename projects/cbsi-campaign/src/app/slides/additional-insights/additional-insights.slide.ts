import {Component} from '@angular/core'
import {CbsiDataService} from '../../services/cbsi-data.service'

@Component({
  selector: 'additional-insights',
  templateUrl: './additional-insights.slide.html',
  styleUrls: ['./additional-insights.slide.less']
})
export class AdditionalInsightsSlide {
  chart1Value = 50
  chart2Value = 50
  chart3Value = 50
  chart4Value = 0
  chart5Value = 50
  chart6Value = 50
  chart7Value = 50
  chart8Value = 50
  chart9Value = 50
  chart10Value = 50
  loading = true

  constructor(dataService: CbsiDataService) {
    dataService
      .totals()
      .subscribe(totals => {
        this.chart4Value = totals && totals.ctr || 0
        this.chart10Value = totals && totals.moat_viewability_rate || 0
        this.loading = false
      })
  }
}
