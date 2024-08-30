import {Component} from '@angular/core'
import {StandardDataService, Creative} from '../../services/standard-data.service'

@Component({
  selector: 'top-creatives',
  templateUrl: './top-creatives.slide.html',
  styleUrls: ['./top-creatives.slide.less']
})
export class TopCreativesSlide {
  loading = true
  creativeGroups: Creative[][]
  totalMetrics = {}

  constructor(dataService: StandardDataService) {
    dataService.creatives().subscribe(creatives => {
      this.loading = false
      this.totalMetrics['total_line_item_level_impressions'] = creatives.map('metrics.total_line_item_level_impressions.value').sum()
      this.totalMetrics['total_line_item_level_clicks'] = creatives.map('metrics.total_line_item_level_clicks.value').sum()
      this.creativeGroups = creatives
        .sortBy('metrics.total_line_item_level_impressions.value', true)
        .filter(creative => !creative.width || creative.width > 1)
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
  static CLICKS_PALLET = [TopCreativesSlide.DEFAULT_OPTIONS.CLICKS_COLOR, TopCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];
  static IMPRESSION_PALLET = [TopCreativesSlide.DEFAULT_OPTIONS.IMPRESSION_COLOR, TopCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];

  pieSeries = [{
    innerSize: TopCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
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
    innerSize: TopCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
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
      height: TopCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: TopCreativesSlide.IMPRESSION_PALLET,
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
      height: TopCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: TopCreativesSlide.CLICKS_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      }
    }
  }
}
