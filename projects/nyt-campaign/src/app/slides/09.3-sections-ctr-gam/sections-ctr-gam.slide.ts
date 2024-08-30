import {combineLatest} from 'rxjs'
import {Component ,Input} from '@angular/core'
import {NytDataService, Metadata, Section, Subsection} from '../../services/nyt-data.service'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../services/nyt-settings.service'


@Component({
  selector: 'sections-ctr-gam',
  templateUrl: './sections-ctr-gam.slide.html',
  styleUrls: ['./sections-ctr-gam.slide.less']
})
export class SectionsCtrGamSlide {
  loading = true
  metadata?: Metadata
  @Input() backgroundColor: string;
  @Input() fontStyling: string;
  sectionCtrChartSeries: ChartSeries[] = []
  sectionCtrChartOptions = {
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
  subsectionCtrChartSeries: ChartSeries[] = []
  subsectionCtrChartOptions = {
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
      dataService.sections(),
      dataService.subsections(),
      dataService.metadata(),
      settingsService.settingData('colorTheme'),
    ]).subscribe(([sections, subsections, metadata, theme]) => {
      this.loading = false
      this.metadata = metadata
      const colors = variables.colors.themes[theme.data]
      let filteredSections = sections
        .filter((section: Section) => (section.metrics.dfp_total_line_item_level_impressions > 25000 && section.name != null))
        .sort((a, b) => (b.metrics.dfp_ctr - a.metrics.dfp_ctr))
        .slice(0, 5)
        .map((section: Section) => ({name: section.name, y:section.metrics.dfp_ctr}))
      let filteredSubsections = subsections
        .filter((subsection: Subsection) => (subsection.metrics.dfp_total_line_item_level_impressions > 25000 && subsection.name != null))
        .sort((a, b) => (b.metrics.dfp_ctr - a.metrics.dfp_ctr))
        .slice(0, 5)
        .map((subsection: Subsection) => ({name: subsection.name, y:subsection.metrics.dfp_ctr}))

      if (!sections) return

      this.sectionCtrChartSeries = [{
        name: 'Section CTR',
        data: filteredSections,
        color: colors.secondary
      }]
      this.subsectionCtrChartSeries = [{
        name: 'Subsection CTR',
        data: filteredSubsections,
        color: colors.primary
      }]
      this.sectionCtrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} CTR by Top Section`
      this.subsectionCtrChartOptions.title['text'] = `${(metadata && (metadata.advertiser || metadata.name)) || ''} CTR by Top Subsection`
    })
  }
}
