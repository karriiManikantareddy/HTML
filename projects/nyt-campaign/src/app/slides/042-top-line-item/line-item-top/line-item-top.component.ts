import {Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core'
import {LineItem, safeDiv} from '../../../services/nyt-data.service'
import * as $ from 'jquery'
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model'
import {Variables} from 'projects/template-module/src/lib/variables'
import {NytSettingsService} from '../../../services/nyt-settings.service'

export interface MetricChangeEvent {
  value: number,
  metric: string,
  lineItemName: string,
}

@Component({
  selector: 'line-item-top',
  templateUrl: './line-item-top.component.html',
  styleUrls: ['./line-item-top.component.less']
})

export class LineItemTopComponent implements OnInit, OnChanges {
  @Input() lineItem: LineItem = <any> null
  @Input() totalMetrics: Partial<Record<string, number>> = {}
  @Input() useThirdParty: boolean = false
  @ViewChild('iframe', { static: false }) iframe?: ElementRef<HTMLIFrameElement>
  @ViewChild('iframeWrap', { static: false }) iframeWrap?: ElementRef<HTMLElement>
  @Output() metricChange = new EventEmitter<MetricChangeEvent>()

  originalLineItem: LineItem

  private maxWidth = 520
  private maxHeight = 250
  private paddingBottom = 30

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
  impressionsGaugeOptions: any
  clicksGaugeOptions: any

  shareOfTotals: Partial<Record<string, number|undefined>> = {}
  shareOfImpressionsSeries: ChartSeries[] = []
  shareOfClicksSeries: ChartSeries[] = []

  constructor(
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
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
    if (!this.lineItem) throw new Error("lineItem required")
    this.originalLineItem = JSON.parse(JSON.stringify(this.lineItem))
    this.calculateShareAndChartSeries()
  }

  private calculateShareAndChartSeries() {
    const shareOfTotals = {}
    if (this.useThirdParty) {
      const shareOfImpressions = shareOfTotals['dr_third_party_impressions']
        = safeDiv(this.lineItem.metrics.dr_third_party_impressions, this.totalMetrics.dr_third_party_impressions)
      const shareOfClicks = shareOfTotals['dr_third_party_clicks']
        = safeDiv(this.lineItem.metrics.dr_third_party_clicks, this.totalMetrics.dr_third_party_clicks)
      this.shareOfImpressionsSeries = [{
        data: [{y: shareOfImpressions}, {y: 1 - (shareOfImpressions || 0)}]
      }]
      this.shareOfClicksSeries = [{
        data: [{y: shareOfClicks}, {y: 1 - (shareOfClicks || 0)}]
      }]
    } else {
      const shareOfImpressions = shareOfTotals['dfp_total_line_item_level_impressions']
        = safeDiv(this.lineItem.metrics.dfp_total_line_item_level_impressions, this.totalMetrics.dfp_total_line_item_level_impressions)
      const shareOfClicks = shareOfTotals['dfp_total_line_item_level_clicks']
        = safeDiv(this.lineItem.metrics.dfp_total_line_item_level_clicks, this.totalMetrics.dfp_total_line_item_level_clicks)
      this.shareOfImpressionsSeries = [{
        data: [{y: shareOfImpressions}, {y: 1 - (shareOfImpressions || 0)}]
      }]
      this.shareOfClicksSeries = [{
        data: [{y: shareOfClicks}, {y: 1 - (shareOfClicks || 0)}]
      }]
    }
    this.shareOfTotals = shareOfTotals
  }

  inputChange(value: string | null, metric: string) {
    const numericValue = Number(value && value.replaceAll(',', ''))
    this.metricChange.emit({value: numericValue, metric, lineItemName: this.lineItem.name})
  }
}
