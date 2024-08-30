import { Component } from '@angular/core'

@Component({
  selector: 'test2',
  templateUrl: './test2.slide.html',
  styleUrls: ['./test2.slide.less']
})
export class Test2Slide {
  series = [{
    name: 'test',
    data: [
      null, null, null, null, null, 6, 11, 32, 110, 235,
      369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
      20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
      26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
      24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
      21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
      10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
      5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
    ]
  }]

  lineBarSeries = [{
    name: 'Rainfall',
    type: 'column',
    yAxis: 1,
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
  }, {
    name: 'Temperature',
    type: 'line',
    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
  }]

  lineBarOptions = {
    yAxis: [{
      title: {
        enabled: false
      }
    }, {
      title: {
        enabled: false
      },
      opposite: true
    }]
  }

  pieSeries = [{
    innerSize: '80%',
    data: [
      ['Chrome', 58.9],
      ['Firefox', 13.29],
      ['Internet Explorer', 13],
      ['Edge', 3.78],
      ['Safari', 3.42],
      {
          name: 'Other',
          y: 7.61,
          dataLabels: {
              enabled: false
          }
      }
    ]
  }]

  pieOptions = {
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      }
    }
  }
}
