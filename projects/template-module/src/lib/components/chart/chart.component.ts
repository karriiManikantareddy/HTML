import { Component, OnChanges, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core'
import { ChartSeries } from '../../services/result.model';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnChanges {
  @ViewChild('containerRef', { static: true }) containerRef?: ElementRef<HTMLElement>
  @Input() type = 'line'
  @Input() series: ChartSeries[] = []
  @Input() options: object = {}
  @Input() benchmarks: any
  @Input() bgcolor: string;
  @Input() axisLabelColor: string;
  ngOnChanges() {
    const defaultOptions = Object.clone(DEFAULT_OPTIONS, true)
    const seriesAndBenchmarks = Object.assign([], this.series)
    let mergedOptions
    if (this.benchmarks && Object.keys(this.benchmarks).length > 0) {
      seriesAndBenchmarks.push(this.benchmarks[0])
      mergedOptions = Object.addAll(
        defaultOptions,
        [
          <any> { chart: { type: this.type } },
          <any> this.options,
          <any> { series: this.ensureNullValues(seriesAndBenchmarks) },
        ],
        { deep: true }
      );
    } else {
      mergedOptions = Object.addAll(
        defaultOptions,
        [
          <any> { chart: { type: this.type } },
          <any> this.options,
          <any> { series: this.ensureNullValues(this.series) },
        ],
        { deep: true }
      );
    }
    if (this.bgcolor && this.bgcolor === '#FFFFFF') {
      (<any>mergedOptions).title.style.color = '#949497';
    } else if (this.bgcolor && this.bgcolor === '#000000') {
      (<any>mergedOptions).title.style.color = '#FFFFFF';
    };
    this.copyChartStyleToLabels(mergedOptions);
    const highcharts = (<any>window).Highcharts
    if (highcharts && highcharts.chart) {
      highcharts.chart(this.containerRef && this.containerRef.nativeElement, mergedOptions)
    }
  }

  // Highcharts will not render date series properly if values are undefined
  private ensureNullValues(series: ChartSeries[]) {
    const newSeries = (series || []).map(s => {
      const newData = s.data && s.data.map(d => {
        if (Object.isObject(d)) {
          return Object.merge(d, {y: d.y || 0})
        } else if (Object.isArray(d)) {
          return d.map(_d => _d || 0)
        } else {
          return d || 0
        }
      })
      return Object.merge(s, {data: newData})
    })
    return newSeries
  }

  private copyChartStyleToLabels(options: any): void {
    const style = options['chart']['style']
    style.color = this.axisLabelColor ? this.axisLabelColor : '#949497';
    for (const x of ['xAxis', 'yAxis']) {
      for (const axis of [options[x]].flatten()) {
        Object.merge(axis, {labels: {style: style}}, {deep: true})
      }
    }
  }
}

const DEFAULT_OPTIONS = {
  chart: {
    type: 'line',
    animation: false,
    backgroundColor: null,
    style: {
    	color: '#949497',
      fontFamily: '"DIN2014-Light", sans-serif',
      fontSize: '14px',
    },
  },
  credits: {
   enabled: false
  },
  title: null,
  legend: {
    enabled: false
  },
  yAxis: [{
    title: null,
  }],
  plotOptions: {
    series: {
      animation: false,
      marker: {
        enabled: false,
      },
      states: {
        hover: {
          enabled: false
        }
      }
    }
  },
  tooltip: {
    enabled: false
  }
}
