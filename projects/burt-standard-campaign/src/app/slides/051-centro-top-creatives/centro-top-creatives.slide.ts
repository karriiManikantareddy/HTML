import {Component} from '@angular/core'
import {StandardDataService, Creative} from '../../services/standard-data.service'

@Component({
  selector: 'centro-top-creatives',
  templateUrl: './centro-top-creatives.slide.html',
  styleUrls: ['./centro-top-creatives.slide.less']
})
export class CentroTopCreativesSlide {
  loading = true
  creativeGroups: Creative[][]
  totalMetrics = {}

  constructor(dataService: StandardDataService) {
    dataService.centroCreatives().subscribe(creatives => {
      this.loading = false
      this.totalMetrics['imps_won'] = creatives.map('metrics.imps_won.value').sum()
      this.totalMetrics['clicks'] = creatives.map('metrics.clicks.value').sum()

      this.creativeGroups = creatives
        .sortBy('metrics.imps_won.value', true)
        .filter(creative => creative.width > 1)
        .slice(0, 4)
        .inGroupsOf(2)
        .map('compact')
    })
  }

  static DEFAULT_OPTIONS = {
    HEIGHT: 160,
    IMPRESSION_COLOR: '#48ABDF',
    CLICKS_COLOR: '#9F2BDD',
    SECONDARY_COLOR: 'rgb(234, 240, 244)',
    INNER_SIZE: '90%'
  }
  static CLICKS_PALLET = [CentroTopCreativesSlide.DEFAULT_OPTIONS.CLICKS_COLOR, CentroTopCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];
  static IMPRESSION_PALLET = [CentroTopCreativesSlide.DEFAULT_OPTIONS.IMPRESSION_COLOR, CentroTopCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];

  pieSeries = [{
    innerSize: CentroTopCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
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
    innerSize: CentroTopCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
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
      height: CentroTopCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: CentroTopCreativesSlide.IMPRESSION_PALLET,
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
      height: CentroTopCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: CentroTopCreativesSlide.CLICKS_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      }
    }
  }
}
