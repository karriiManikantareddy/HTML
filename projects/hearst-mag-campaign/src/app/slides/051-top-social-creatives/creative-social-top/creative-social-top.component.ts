import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core'
import {Creative} from '../../../services/hearst-magazines-data.service'
import * as $ from 'jquery'
import {Variables} from 'projects/template-module/src/lib/variables'

@Component({
  selector: 'creative-social-top',
  templateUrl: './creative-social-top.component.html',
  styleUrls: ['./creative-social-top.component.less']
})
export class CreativeSocialTopComponent implements OnInit {
  @Input() creative: Creative
  @Input() totalMetrics: any
  private maxWidth = 520
  private maxHeight = 250
  private paddingBottom = 30

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

  constructor(
    variables: Variables,
  ) {
    const colors = variables.colors
    this.impressionsGaugeOptions = Object.add(this.gaugeOptions, {colors: [colors.clicks, colors.impressions]})
    this.clicksGaugeOptions = Object.add(this.gaugeOptions, {colors: [colors.clicks, colors.impressions]})
  }

  ngOnInit() {
    const shareOfImpressions = this.shareOfTotals['impressions'] = <number>Object.get(this.creative, 'metrics.impressions.value') / this.totalMetrics['impressions']
    const shareOfClicks = this.shareOfTotals['clicks'] = <number>Object.get(this.creative, 'metrics.clicks.value') / this.totalMetrics['clicks']
    this.shareOfImpressionsSeries = [{
      data: [{y: shareOfImpressions}, {y: 1-shareOfImpressions}]
    }]

    this.shareOfClicksSeries = [{
      data: [{y: shareOfClicks}, {y: 1-shareOfClicks}]
    }]
  }
}
