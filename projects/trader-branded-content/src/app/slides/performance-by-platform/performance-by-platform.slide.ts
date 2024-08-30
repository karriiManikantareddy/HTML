import {Component, OnInit} from '@angular/core'
import { Options, IndividualSeriesOptions, DataPoint } from 'highcharts'
import {StandardDataService, DfpPlatform} from '../../services/standard-data.service'
import {TraderVariables} from '../../variables'

@Component({
  selector: 'performance-by-platform',
  templateUrl: './performance-by-platform.slide.html',
  styleUrls: ['./performance-by-platform.slide.less']
})
export class PerformanceByPlatformSlide {
  loading = true
  platforms: DfpPlatform[]
  series: IndividualSeriesOptions[] = []
  shareOfTotal = {}

  options: Options = {
    chart: {
      type: 'pie',
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      },
    },
  }

  constructor(
    dataService: StandardDataService,
    variables: TraderVariables
  ) {
    dataService.dfpPlatforms()
      .subscribe(platforms => {
        this.loading = false
        this.platforms = platforms.sortBy('metrics.total_line_item_level_impressions', true)
        this.series = [{
            data: platforms
              .map((platform): DataPoint => ({
                  name: platform.name,
                  y: platform.metrics.total_line_item_level_impressions,
                  color: variables.colors[platform.name.toLowerCase()],
                }),
              ),
            type: 'pie',
            innerSize: '50%',
          },
        ]
      })
  }
}

