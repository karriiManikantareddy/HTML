import {Component} from '@angular/core'
import {HearstMagazinesDataService, Creative} from '../../services/hearst-magazines-data.service'

@Component({
  selector: 'top-social-creatives',
  templateUrl: './top-social-creatives.slide.html',
  styleUrls: ['./top-social-creatives.slide.less']
})
export class TopSocialCreativesSlide {
  loading = true
  creativeGroups: Creative[][]
  totalMetrics = {}

  constructor(dataService: HearstMagazinesDataService) {
    dataService.socialCreatives().subscribe(creatives => {
      this.loading = false
      this.totalMetrics['impressions'] = creatives.map('metrics.impressions.value').sum()
      this.totalMetrics['clicks'] = creatives.map('metrics.clicks.value').sum()
      this.totalMetrics['ctr'] = creatives.map('metrics.ctr.value').sum()
      this.totalMetrics['likes'] = creatives.map('metrics.likes.value').sum()
      this.creativeGroups = creatives
        .sortBy('metrics.impressions.value', true)
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
  static CLICKS_PALLET = [TopSocialCreativesSlide.DEFAULT_OPTIONS.CLICKS_COLOR, TopSocialCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];
  static IMPRESSION_PALLET = [TopSocialCreativesSlide.DEFAULT_OPTIONS.IMPRESSION_COLOR, TopSocialCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];

  pieSeries = [{
    innerSize: TopSocialCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
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
    innerSize: TopSocialCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
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
      height: TopSocialCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: TopSocialCreativesSlide.IMPRESSION_PALLET,
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
      height: TopSocialCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: TopSocialCreativesSlide.CLICKS_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      }
    }
  }
}
