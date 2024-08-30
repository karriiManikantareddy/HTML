import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import {SimplifiDataService, Item} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-keyword-breakdown',
  templateUrl: './simplifi-keyword-breakdown.slide.html',
  styleUrls: ['./simplifi-keyword-breakdown.slide.less']
})
export class SimplifiKeywordBreakdownSlide {
  loading = true
  keywords?: Item[]
  kpis = ['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits']
  series: any[]
  legendItems: any[] = []
  options: any = {
    chart: {
      margin: [0, 0, 0, 0],
      height: 500,
      width: 500,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: 18.5,
          },
        },
      },
    },
  }
  primaryColor: string = '#E05534'
  theme: string = 'dark'

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
    ) {
    combineLatest(
      dataService.simplifiKeywordsBreakdownItems(),
      dataService.simplifiDeviceBreakdownItems(),
    ).subscribe(([keywords, devices]) => {
      this.loading = false
      this.keywords = keywords
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)

      this.options = Object.add(this.options, {colors: variables.colors[this.theme].chart})
      let filteredDevices: any = devices.filter(d => d.metrics.impressions.value > 1000)
      this.series = filteredDevices.map(device => { return { name: device.name, data: [device.metrics.impressions.value] }})
      filteredDevices.forEach((channel, i) => {
          this.legendItems.push({name: channel.name, color: variables.colors[this.theme].chart[i]})
      })
    })
    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
    })
    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
    })
    settingsService.settingData('campaignTactic').subscribe(goal => {
      this.kpis = dataService.filterKPIs(['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits'], goal.data)
    })
  }
}
