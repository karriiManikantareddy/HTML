import {Component, ElementRef} from '@angular/core'
import { Options, IndividualSeriesOptions, DataPoint } from 'highcharts'
import {TraderDataService, Platform} from '../../services/trader-data.service'
import {Variables} from 'projects/template-module/src/lib/variables'

@Component({
  selector: 'platforms',
  templateUrl: './platforms.slide.html',
  styleUrls: ['./platforms.slide.less']
})
export class PlatformsSlide {
  loading = true
  orderedPlatforms = ['Desktop', 'Tablet', 'Smartphone']
  platforms: Platform[]
  series: IndividualSeriesOptions[] = []
  shareOfTotal = {}

  options: Options = {
    chart: {
      type: 'pie',
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            fontSize: "20px",
          }
        },
      },
    },
  }


  constructor(dataService: TraderDataService, variables: Variables) {
   const colors = {
    'Desktop': variables.colors.impressions,
    'Tablet': variables.colors.clicks, 
    'Smartphone': variables.colors.lightBlue
  }
    dataService
      .platforms()
      .subscribe(platforms => {
        this.loading = false
        const filteredPlatforms = platforms.filter(platform => this.orderedPlatforms.includes(platform.name))
        const sum = filteredPlatforms.map('metrics.total_line_item_level_impressions').sum()
        for (const platform of filteredPlatforms) {
          const value = <number> Object.get(platform, 'metrics.total_line_item_level_impressions') || 0
          this.shareOfTotal[platform.name] = value / sum
        }
        this.platforms = filteredPlatforms.sortBy('metrics.total_line_item_level_impressions', true)
        this.series = [
          {
            data: filteredPlatforms
              .map(
                (platform): DataPoint => ({
                  name: platform.name,
                  y: platform.metrics.total_line_item_level_impressions,
                  color: colors[platform.name],
                }),
              ),
            type: 'pie',
            innerSize: '50%',
          },
        ]
      })
  }
}
