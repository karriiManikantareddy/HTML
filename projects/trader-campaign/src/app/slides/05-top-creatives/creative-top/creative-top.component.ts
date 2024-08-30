import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core'
import {Creative} from '../../../services/trader-data.service'
import * as $ from 'jquery'
import {Variables} from 'projects/template-module/src/lib/variables'

@Component({
  selector: 'creative-top',
  templateUrl: './creative-top.component.html',
  styleUrls: ['./creative-top.component.less']
})
export class CreativeTopComponent implements OnInit {
  @Input() creative: Creative
  @Input() totalMetrics: any
  @ViewChild('iframe', { static: true }) iframe: ElementRef
  @ViewChild('iframeWrap', { static: true }) iframeWrap: ElementRef
  private maxWidth = 520
  private maxHeight = 250
  private paddingBottom = 30
  private el: ElementRef

  private size = 195
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

  shareOfTotals = {}
  shareOfImpressionsSeries: any[]
  shareOfClicksSeries: any[]

  constructor(el: ElementRef, variables: Variables) {
    this.el = el
    const colors = variables.colors
    this.impressionsGaugeOptions = Object.add(this.gaugeOptions, {colors: [colors.impressions, colors.secondary]})
    this.clicksGaugeOptions = Object.add(this.gaugeOptions, {colors: [colors.clicks, colors.secondary]})
  }

  ngOnInit() {
    const shareOfImpressions = this.shareOfTotals['total_line_item_level_impressions'] = this.creative.metrics['total_line_item_level_impressions'] / this.totalMetrics['total_line_item_level_impressions']
    const shareOfClicks = this.shareOfTotals['total_line_item_level_clicks'] = this.creative.metrics['total_line_item_level_clicks'] / this.totalMetrics['total_line_item_level_clicks']

    const w = this.creative.width
    const h = this.creative.height
    const pb = this.paddingBottom
    const containers = this.el.nativeElement.closest('section').querySelectorAll('.wrap-img');
    let maxH = 0;

    if (w > this.maxWidth || h > this.maxHeight) {
      let widthFactor = this.maxWidth / w
      let heightFactor = this.maxHeight / h
      const factor = Math.min(widthFactor, heightFactor)

      $(this.iframeWrap.nativeElement).height(`${factor * h + pb}px`)

      $(this.iframe.nativeElement).css({
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
        const h = $(element).height();
        if (h > maxH) maxH = h
        else $(element).height(maxH)
      })
    })

    this.shareOfImpressionsSeries = [{
      data: [{y: shareOfImpressions}, {y: 1-shareOfImpressions}]
    }]

    this.shareOfClicksSeries = [{
      data: [{y: shareOfClicks}, {y: 1-shareOfClicks}]
    }]
  }
}
