import {combineLatest} from 'rxjs'
import {Component, Input} from '@angular/core'
import {NytDataService, Metadata} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../services/nyt-settings.service'


@Component({
  selector: 'sections-vcr-benchmarks',
  templateUrl: './sections-vcr-benchmarks.slide.html',
  styleUrls: ['./sections-vcr-benchmarks.slide.less']
})
export class SectionsVcrBenchmarksSlide {
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  loading = true
  metadata?: Metadata
  sectionVcrChartSeries: ChartSeries[] = []
  sectionVcrChartOptions = {
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
          text: 'Section',
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
  subsectionVcrChartSeries: ChartSeries[] = []
  subsectionVcrChartOptions = {
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
        text: 'Subsection',
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

      this.sectionVcrChartSeries = [{
        name: 'Section VCR',
        data: selectedBenchmark.benchmark_section_vcr,
        color: colors.secondary
      }]
      this.subsectionVcrChartSeries = [{
        name: 'Subsection VCR',
        data: selectedBenchmark.benchmark_subsection_vcr,
        color: colors.primary
      }]
      this.sectionVcrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} VCR by Top Section`
      this.subsectionVcrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} VCR by Top Subsection`
    })
  }
}
