import {Component, Input} from '@angular/core'
import {Creative} from '../../../services/standard-data.service'

@Component({
  selector: 'creative-left',
  templateUrl: './creative-left.component.html',
  styleUrls: ['./creative-left.component.less']
})
export class CreativeLeftComponent {
  @Input() creative: Creative

  static DEFAULT_OPTIONS = {
    HEIGHT: 160,
    IMPRESSION_COLOR: '#48ABDF',
    CLICKS_COLOR: '#9F2BDD',
    SECONDARY_COLOR: 'rgb(234, 240, 244)',
    INNER_SIZE: '90%'
  }
  static CLICKS_PALLET = [CreativeLeftComponent.DEFAULT_OPTIONS.CLICKS_COLOR, CreativeLeftComponent.DEFAULT_OPTIONS.SECONDARY_COLOR];
  static IMPRESSION_PALLET = [CreativeLeftComponent.DEFAULT_OPTIONS.IMPRESSION_COLOR, CreativeLeftComponent.DEFAULT_OPTIONS.SECONDARY_COLOR];

  pieSeries = [{
    innerSize: CreativeLeftComponent.DEFAULT_OPTIONS.INNER_SIZE,
    data: [
      ['Total', 20],
      {
        name: '',
        y: 80,
        dataLabels: {
          enabled: false
        }
      }
    ]
  }]

  purplePieSeries = [{
    innerSize: CreativeLeftComponent.DEFAULT_OPTIONS.INNER_SIZE,
    data: [
      ['Total', 25],
      {
        name: '',
        y: 75,
        dataLabels: {
          enabled: false
        }
      }
    ]
  }]

  pieOptions = {
    chart: {
      height: CreativeLeftComponent.DEFAULT_OPTIONS.HEIGHT
    },
    colors: CreativeLeftComponent.IMPRESSION_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false
        }
      }
    }
  }

  purplePieOptions = {
    chart: {
      height: CreativeLeftComponent.DEFAULT_OPTIONS.HEIGHT
    },
    colors: CreativeLeftComponent.CLICKS_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      }
    }
  }
}
