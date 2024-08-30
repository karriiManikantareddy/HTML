import {combineLatest} from 'rxjs'
import {Component, Input} from '@angular/core'
import {NytDataService, Metadata} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../services/nyt-settings.service'


@Component({
  selector: 'device-ad-type-vcr-benchmarks',
  templateUrl: './device-ad-type-vcr-benchmarks.slide.html',
  styleUrls: ['./device-ad-type-vcr-benchmarks.slide.less']
})
export class DeviceAdTypeVcrBenchmarksSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  loading = true
  metadata?: Metadata
  deviceVcrChartSeries: ChartSeries[] = []
  deviceVcrChartOptions = {
    chart: {
      height: 500,
      width: 800,
      type: 'column',
    },
    title: {
      text: '',
      align: 'left',
      style: {
        color: '#949497'
      }
    },
    xAxis: [
      {
        type: 'category',
        title: {
          text: 'Device',
          margin: 20
        },
      }
    ],
    yAxis: [
      {
        title: {
          text: 'VCR',
          margin: 20
        },
        labels: {
          formatter: function f(this: {value: number}): string {
            return `${(this.value * 100).round(3)}%`
          }
        }
      }
    ]
  }
  adTypeVcrChartSeries: ChartSeries[] = []
  adTypeVcrChartOptions = {
    chart: {
      height: 500,
      width: 800,
      type: 'column',
    },
    title: {
      text: '',
      align: 'left',
      style: {
        color: '#949497'
      }
    },
    xAxis: {
      type: 'category',
      title: {
        text: 'Ad Type',
        margin: 20
      },
    },
    yAxis: [
      {
        title: {
          text: 'VCR',
          margin: 20
        },
        labels: {
          formatter: function f(this: {value: number}): string {
            return `${(this.value * 100).round(3)}%`
          }
        }
      }
    ]
  }

  constructor(
    dataService: NytDataService,
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
    combineLatest([
      dataService.benchmarksFiltered(),
      dataService.metadata(),
      settingsService.settingData('colorTheme'),
    ]).subscribe(([benchmarksFiltered, metadata, theme]) => {
      this.loading = false
      this.metadata = metadata
      const colors = variables.colors.themes[theme.data]
      let selectedBenchmark = benchmarksFiltered;

      if (!selectedBenchmark) return

      this.deviceVcrChartSeries = [{
        name: 'Device VCR',
        data: selectedBenchmark.benchmark_device_vcr,
        color: colors.secondary
      }]
      this.adTypeVcrChartSeries = [{
        name: 'Ad Type VCR',
        data: selectedBenchmark.benchmark_ad_type_vcr,
        color: colors.primary
      }]
      this.deviceVcrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} VCR by Device`
      this.adTypeVcrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} VCR by Ad Type`
    })
  }
}
