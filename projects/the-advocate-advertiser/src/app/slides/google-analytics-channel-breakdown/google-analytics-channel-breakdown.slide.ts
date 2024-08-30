import { Component } from '@angular/core'
import { Variables } from 'projects/template-module/src/lib/variables'
import { TheAdvocateDataService, Item } from '../../services/the-advocate-data.service'

@Component({
  selector: 'google-analytics-channel-breakdown',
  templateUrl: './google-analytics-channel-breakdown.slide.html',
  styleUrls: ['./google-analytics-channel-breakdown.slide.less'],
})
export class GoogleAnalyticsChannelBreakdownSlide {
  loading: boolean = true
  channels?: Item[]
  kpis: string[] = ['daily_sessions', 'total_revenue']
  series: any[]
  legendItems: any[] = []
  options: any = {
    chart: {
      margin: [0, 0, 0, 0],
      height: 500,
      width: 500,
    },
    plotOptions: {
      pie: {
        size: 500,
        innerSize: '50%',
        dataLabels: {
          enabled: false
        }
      }
    }
  }

  constructor(dataService: TheAdvocateDataService, variables: Variables) {
    dataService.googleAnalyticsChannelBreakdownItems().subscribe(channels => {
      this.loading = false
      this.channels = channels
        .sortBy(c => -c.metrics.daily_sessions.value)
        .slice(0, 5)
      this.options = Object.add(this.options, {colors: variables.colors.chart})
      let totals: number = this.channels.sum(channel => channel.metrics.daily_sessions.value)
      this.series = [{
        data: this.channels.map(channel => { return {y: channel.metrics.daily_sessions.value / totals} })
      }]
      this.channels.map((channel, i) => {
          this.legendItems.push({name: channel.name, color: variables.colors.chart[i]})
      })
    })
  }
}
