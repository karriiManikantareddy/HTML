import {Component} from '@angular/core'
import {combineLatest} from 'rxjs'
import {NprDataService, Product} from '../../services/npr-data.service'

@Component({
  selector: 'podcast-delivery',
  templateUrl: './podcast-delivery.slide.html',
  styleUrls: ['./podcast-delivery.slide.less']
})
export class PodcastDeliverySlide {
  loading = true
  isWhiteFooter: boolean = true
  creativeSizeGroups: Product[]
  totals: any

  constructor(dataService: NprDataService) {
    combineLatest([
      dataService.totals(),
      dataService.products()
    ])
    .subscribe(([totals, products]) => {
      this.loading = false
      this.totals = totals

      this.creativeSizeGroups = products
      .reduce((allProducts, currProd) => {
        let i = allProducts.findIndex((prod) => prod['name'] === currProd['name'])
        if (i == -1) {
          allProducts.push(currProd)
        }
        else {
          allProducts[i].metrics.impressions.value += currProd.metrics.impressions.value
          allProducts[i].shareOfs.impressions += currProd.shareOfs.impressions
        }
        return allProducts
      },[])
      .sortBy('shareOfs.impressions', true)
      .slice(0,6)
    })
  }

  numFormatter(num, decimals) {
    if(num < 100000){
      return (num/1000).toFixed(decimals) + 'K'
    }
    else if (num >= 100000 && num < 1000000) {
      return (num/1000).toFixed(0) + 'K'
    }
    else if(num >= 1000000){
      return (num/1000000).toFixed(decimals) + 'M'
    }
  }

  imgUrl(podName: string) {
    const productImgs = ['assets/img/1a.png','assets/img/ask_me_another.png','assets/img/freshair.png','assets/img/howbuiltthis.png',
    'assets/img/lifekit.png','assets/img/planetmoney.png','assets/img/tedradiohour.png', 'assets/img/waitwait...don\'ttellme!.png']

    podName = podName.replace(/ /g, '').toLowerCase()

    if (productImgs.includes(`assets/img/${podName}.png`)) {
      return `assets/img/${podName}.png`
    }
    else {
      return `assets/img/blank.png`
    }
  }
}