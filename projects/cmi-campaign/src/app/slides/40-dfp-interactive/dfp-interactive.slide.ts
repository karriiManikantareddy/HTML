import {Component} from '@angular/core'
import {CmiDataService} from '../../services/cmi-data.service'

@Component({
  selector: 'dfp-interactive',
  templateUrl: './dfp-interactive.slide.html',
  styleUrls: ['./dfp-interactive.slide.less']
})
export class DfpInteractiveSlide {
  loading = false
  hasDFP = false
  creatives = []
  maxNameLength = 18
  headers = ['dfp_creative_1', 'dfp_creative_2', 'dfp_creative_3']
  metrics = [
    {metric: 'impressions', name_1: 'Impressions Delivered', format: 'number', description: 'No. of times your message was shown'},
    {metric: 'clicks', name_1: 'Clicks', format: 'number', description: 'No. of clicks to your website'},
    {metric: 'ctr', name_1: 'Click Thru Rate', format: 'percent', description: 'No. of clicks / no. of times your message was shown'},
    {metric: 'engagement_rate', name_1: 'Engagement Rate', format: 'percent', description: 'No. of engagements / no. of clicks'},
    {metric: 'avg_dwell_time', name_1: 'Average Dwell Time', format: 'time', description: 'Average amount of time spent interacting with the ad'},
  ]

  constructor(dataService: CmiDataService) {
    dataService.hasDFP().subscribe(hasDFP => this.hasDFP = hasDFP)
  }

  getName(creative, metric) {
    return `${creative}_${metric}`
  }
}
