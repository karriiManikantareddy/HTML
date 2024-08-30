import {Component} from '@angular/core'
import { forkJoin } from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
import {CumulusMediaDataService, WebsiteDevice, WebsiteGender, WebsiteAge} from '../../services/cumulus-media-data.service'

@Component({
  selector: 'website-demo',
  templateUrl: './website-demo.slide.html',
  styleUrls: ['./website-demo.slide.less']
})
export class WebsiteDemoSlide {
  loading = true
  ages: WebsiteAge[]
  genders: WebsiteGender[]
  devices: WebsiteDevice[]
  shareOfTotal = {}
  chartSeries: any[]
  chartOptions: any = {
    xAxis: {
        categories: []
    }
  }
  deviceData: any = [];
  genderData: any = [];
  pieChartOptions: any = {
    chart: {
      height: "600px",
      width: 600
    },
    style: {
      height: "600px"
    }
  };
  colors: any = ['#033242', '#fc4d87', '#12142a']
  empty: boolean = false

  constructor(
    dataService: CumulusMediaDataService,
    variables: Variables,
    ) {
    forkJoin([dataService.websiteGenders(), dataService.websiteDevices(), dataService.websiteAges()])
      .subscribe(([genders, devices, ages]) => {
        this.empty = !genders.length && !devices.length && !ages.length
        this.loading = false
        this.initGenderData(genders)
        this.initDeviceData(devices)
        this.initAgeData(ages)
      })
  }

  private initAgeData(ages) {
    const sum = ages.map('metrics.pageviews').sum()
    for (const gender of ages) {
      const value = <number> Object.get(gender, 'metrics.pageviews') || 0
      this.shareOfTotal[gender.name] = value / sum
    }
    this.ages = ages.sortBy('metrics.pageviews.value', true)
    const chartData = ages.map(age => age.metrics.pageviews.value)
    this.chartOptions['xAxis']['categories'] = ages.map(age => age.name)
    this.chartSeries = [{
      name: 'Age',
      data: chartData,
      color: {
        linearGradient : [1000],
        stops : [
          [0, '#2435c5'],
          [1, '#49c6f8'],
        ]
      }
    }]
  }

  private initDeviceData(devices) {
    this.devices = devices
    this.deviceData = [
      {
        name: "Devices",
        data: devices.map((d, i) => {
          return {
            name: d.name,
            y: d.metrics.pageviews.value,
            color: this.colors[i % 3].color,
            icon: d.name,
            label: {
              enabled: false
            }
          };
        }),
        innerSize: "60%",
        dataLabels: {
          enabled: false
        }
      }
    ];
  }

  private initGenderData(genders) {
    this.genders = genders
    this.genderData = [
      {
        name: "Devices",
        data: genders.map((g, i) => {
          return {
            name: g.name,
            y: g.metrics.pageviews.value,
            color: this.colors[i % 3].color,
            icon: g.name,
            label: {
              enabled: false
            }
          };
        }),
        innerSize: "60%",
        dataLabels: {
          enabled: false
        }
      }
    ];
  }
}
