import {Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core'
import {DfpCreative} from '../../../services/nyt-data.service'
import * as $ from 'jquery'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../../services/nyt-settings.service'

export interface MetricChangeEvent {
  value: number,
  metric: string,
  creativeName: string,
}

@Component({
  selector: 'creative-top',
  templateUrl: './creative-top.component.html',
  styleUrls: ['./creative-top.component.less']
})
export class CreativeTopComponent implements OnInit, OnChanges {
  @Input() creative: DfpCreative = <any> null
  @Input() totalMetrics: Partial<Record<string, number>> = {}
  @Output() metricChange = new EventEmitter<MetricChangeEvent>()
  @ViewChild('iframe', { static: false }) iframe?: ElementRef<HTMLIFrameElement>
  @ViewChild('iframeWrap', { static: true }) iframeWrap?: ElementRef<HTMLElement>

  originalCreative: DfpCreative

  private maxWidth = 520
  private maxHeight = 250
  private paddingBottom = 30
  private el: ElementRef<HTMLElement>

  private size = 250
  private gaugeOptions = {
    chart: {
      margin: [0, 0, 0, 0],
      height: this.size,
      width: this.size,
    },
    plotOptions: {
      pie: {
        size: this.size,
        innerSize: '90%',
        dataLabels: {
          enabled: false
        }
      }
    }
  }
  impressionsGaugeOptions: any = {}
  clicksGaugeOptions: any = {}

  shareOfTotals: Partial<Record<string, number>> = {}
  shareOfImpressionsSeries: ChartSeries[] = []
  shareOfClicksSeries: ChartSeries[] = []

  constructor(
    el: ElementRef<HTMLElement>,
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
    this.el = el
    settingsService.settingData('colorTheme').subscribe(theme => {
      const colors = variables.colors.themes[theme.data]
      this.impressionsGaugeOptions = Object.add(this.gaugeOptions, {colors: [colors.secondary, variables.colors.blank]})
      this.clicksGaugeOptions = Object.add(this.gaugeOptions, {colors: [colors.primary, variables.colors.blank]})
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalMetrics) {
      this.totalMetrics = changes.totalMetrics.currentValue
      this.calculateShareAndChartSeries()
    }
  }

  ngOnInit() {
    if (!this.creative) throw new Error("creative is required")
    this.originalCreative = JSON.parse(JSON.stringify(this.creative))

    this.calculateShareAndChartSeries()

    const w = this.creative.width || 0
    const h = this.creative.height || 0
    const pb = this.paddingBottom
    const nativeElement = this.el.nativeElement
    const closestSection = nativeElement && nativeElement.closest('section')
    const containers = closestSection ? Array.from(closestSection.querySelectorAll('.wrap-img')) : []
    let maxH = 0

    if ((w > this.maxWidth || h > this.maxHeight) && this.iframe) {
      let widthFactor = this.maxWidth / w
      let heightFactor = this.maxHeight / h
      const factor = Math.min(widthFactor, heightFactor)

      this.iframeWrap && $(this.iframeWrap.nativeElement).height(`${factor * h + pb}px`)

      this.iframe && $(this.iframe.nativeElement).css({
        '-moz-transform':           `scale(${factor})`,
        '-moz-transform-origin':    '0 0',
        '-o-transform':             `scale(${factor})`,
        '-o-transform-origin':      '0 0',
        '-webkit-transform':        `scale(${factor})`,
        '-webkit-transform-origin': '0 0',
        '-ms-transform':            `scale(${factor})`,
        '-ms-transform-origin':     '0 0',
        'transform':                `scale(${factor})`,
        'transform-origin':         '0 0',
        'margin':                   '0',
      })
    }

    setTimeout(() => {
      containers.forEach(element => {
        const h = $(element).height()
        if (h && h > maxH) maxH = h
        else $(element).height(maxH)
      })
    })

  }

  private calculateShareAndChartSeries() {
    const shareOfTotals = {}
    const shareOfImpressions = (this.creative.metrics.dfp_total_line_item_level_impressions || 0) / (this.totalMetrics.dfp_total_line_item_level_impressions || this.creative.metrics.dfp_total_line_item_level_impressions || 1)
    const shareOfClicks = (this.creative.metrics.dfp_total_line_item_level_clicks || 0) / (this.totalMetrics.dfp_total_line_item_level_clicks || this.creative.metrics.dfp_total_line_item_level_clicks || 1)
    shareOfTotals['dfp_total_line_item_level_impressions'] = shareOfImpressions
    shareOfTotals['dfp_total_line_item_level_clicks'] = shareOfClicks

    this.shareOfImpressionsSeries = [{
      data: [{y: shareOfImpressions}, {y: 1-shareOfImpressions}]
    }]

    this.shareOfClicksSeries = [{
      data: [{y: shareOfClicks}, {y: 1-shareOfClicks}]
    }]
    this.shareOfTotals = shareOfTotals
  }

  inputChange(value: string | null, metric: string) {
    const numericValue = Number(value && value.replaceAll(',', ''))
    this.metricChange.emit({value: numericValue, metric, creativeName: this.creative.name})
  }
}
