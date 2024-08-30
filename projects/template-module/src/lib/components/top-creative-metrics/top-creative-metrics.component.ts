import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core'
import { Variables } from '../../variables'
import { get, assign } from 'lodash';

@Component({
  selector: 'top-creative-metrics',
  templateUrl: './top-creative-metrics.component.html',
  styleUrls: ['./top-creative-metrics.component.less']
})
export class TopCreativeMetrics implements OnInit, OnChanges {
  @Input() creative: any;
  @Input() totalMetrics: any;
  @Input() primaryColorImpressions: string
  @Input() secondaryColorImpressions: string
  @Input() primaryColorClicks: string
  @Input() secondaryColorClicks: string

  private size: number = 195;
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
  };

  impressionsGaugeOptions: any;
  clicksGaugeOptions: any;

  shareOfTotals = {};
  shareOfImpressionsSeries: any[];
  shareOfClicksSeries: any[];

  constructor(
    variables: Variables,
  ) {
    this.primaryColorImpressions = variables.colors.impressions;
    this.secondaryColorImpressions = variables.colors.secondary;
    this.primaryColorClicks = variables.colors.clicks;
    this.secondaryColorClicks = variables.colors.secondary;
  }

  ngOnInit() {
    this.impressionsGaugeOptions = assign(this.gaugeOptions, {colors: [this.primaryColorImpressions, this.secondaryColorImpressions]});
    this.clicksGaugeOptions = assign(this.gaugeOptions, {colors: [this.primaryColorClicks, this.secondaryColorClicks]});
    const shareOfImpressions = this.shareOfTotals['gam_impressions'] = <number>get(this.creative, 'metrics.gam_impressions.value') / this.totalMetrics['gam_impressions']
    const shareOfClicks = this.shareOfTotals['gam_clicks'] = <number>get(this.creative, 'metrics.gam_clicks.value') / this.totalMetrics['gam_clicks']

    this.shareOfImpressionsSeries = [{
      data: [{y: shareOfImpressions}, {y: 1-shareOfImpressions}]
    }]

    this.shareOfClicksSeries = [{
      data: [{y: shareOfClicks}, {y: 1-shareOfClicks}]
    }]
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.impressionsGaugeOptions = { ...this.gaugeOptions, colors: [this.primaryColorImpressions, this.secondaryColorImpressions] };
    this.clicksGaugeOptions = { ...this.gaugeOptions, colors: [this.primaryColorClicks, this.secondaryColorClicks] };
  }
}
