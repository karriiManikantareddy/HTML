import {Component, OnChanges, ElementRef, ViewChild, Input, ChangeDetectionStrategy} from '@angular/core'
import { ChartSeries } from '../../services/result.model'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnChanges {
  @ViewChild('containerRef', { static: true }) containerRef?: ElementRef<HTMLElement>
  @Input() series: ChartSeries[] = []
  @Input() options: any = {}
  @Input() bgcolor: string;
  @Input() redraw: Observable<boolean>
  subscription: Subscription
  mapChart

  ngOnChanges() {
    const mergedOptions = Object.addAll(
      DEFAULT_OPTIONS,
      [
        this.options,
        <any> {series: this.ensureNullValues(this.series)}
      ],
      {deep: true}
    );
    if (this.bgcolor) {
      (<any>mergedOptions).chart.backgroundColor = this.bgcolor;
    }
    this.copyChartStyleToLabels(mergedOptions);
    const highcharts = (<any>window).Highcharts
    if (highcharts && highcharts.mapChart) {
      this.mapChart = highcharts.mapChart(this.containerRef && this.containerRef.nativeElement, mergedOptions)
    }
    if (this.redraw && !this.subscription) {
      this.subscription = this.redraw.subscribe(() => {
        this.mapChart.update(this.options, true)
        this.mapChart.reflow()
      })
    }
  }

  // Highcharts will not render date series properly if values are undefined
  private ensureNullValues(series?: ChartSeries[]): ChartSeries[] {
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
      return <ChartSeries> Object.merge(s, {data: newData})
    })
    return newSeries
  }

  private copyChartStyleToLabels(options: any) {
    const style = options['chart']['style']
    for (const x of ['xAxis', 'yAxis']) {
      for (const axis of [options[x]].flatten()) {
        Object.merge(axis, {labels: {style: style}}, {deep: true})
      }
    }
  }
}

const DEFAULT_OPTIONS = {
  chart: {
    map: 'countries/us/us-all',
    backgroundColor: null,
    animation: false,
    verticalAlign: 'top',
    style: {
      color: '#949497',
      fontFamily: '"DIN2014-Light", sans-serif',
      fontSize: '14px',
      height: '600px',
      verticalAlign: 'top',
    },
  },
  credits: {
    enabled: false
  },
  title: null,
  colorAxis: {
    min: 1,
    type: 'logarithmic',
    minColor: '#EEEEFF',
    maxColor: '#000022',
    stops: [
      [0, '#EFEFFF'],
      [0.67, '#4444FF'],
      [1, '#000022']
    ]
  },
  legend: {
    enabled: false,
    layout: 'horizontal',
    verticalAlign: 'bottom',
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    floating: true,
    align: 'right',
    width: 400,
    x: 100,
    y:100
  },
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
