import {combineLatest} from 'rxjs'
import {Component, Input} from '@angular/core'
import {NytDataService, Metadata} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../services/nyt-settings.service'


@Component({
  selector: 'device-ad-type-ctr-benchmarks',
  templateUrl: './device-ad-type-ctr-benchmarks.slide.html',
  styleUrls: ['./device-ad-type-ctr-benchmarks.slide.less']
})
export class DeviceAdTypeCtrBenchmarksSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  loading = true
  metadata?: Metadata
  deviceCtrChartSeries: ChartSeries[] = []
  deviceCtrChartOptions = {
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
          text: 'CTR',
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
  adTypeCtrChartSeries: ChartSeries[] = []
  adTypeCtrChartOptions = {
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
        text: 'AdType',
        margin: 20
      },
    },
    yAxis: [
      {
        title: {
          text: 'CTR',
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

      this.deviceCtrChartSeries = [{
        name: 'Device CTR',
        data: selectedBenchmark.benchmark_device_ctr,
        color: colors.secondary
      }]
      this.adTypeCtrChartSeries = [{
        name: 'AdType CTR',
        data: selectedBenchmark.benchmark_ad_type_ctr,
        color: colors.primary
      }]
      this.deviceCtrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} CTR by Device`
      this.adTypeCtrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} CTR by Ad Type`
    })
  }
}
