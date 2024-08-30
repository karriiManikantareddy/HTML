import {Component} from '@angular/core'
import { NprDataService, Metadata } from '../../services/npr-data.service'
import { ChartSeries } from 'projects/template-module/src/lib/services/result.model'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'delivery-by-age',
  templateUrl: './delivery-by-age.slide.html',
  styleUrls: ['./delivery-by-age.slide.less']
})
export class DeliveryByAgeSlide {
  loading = true
  metadata: Metadata
  chartSeries: ChartSeries[] = []
  categories: any[] = []

  chartOptions = {
    chart: {
      type: 'column',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      }
    },
    xAxis: [
      {
        categories: this.categories,
        title: null,
      }
    ],
    yAxis: [
      {
        title: null,
        reversedStacks: false,
        labels: {
          formatter: function f(this: {value: number}): string {
            return `${(this.value.toLocaleString('en-US'))}`
          }
        }
      }
    ],
    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      itemMarginBottom: 20,
      symbolRadius: 0,
      x: 0,
      y: 200,
      itemStyle: {
        fontSize: '18px',
        fontWeight: 'light'
      }
    },
  }

  constructor(dataService: NprDataService) {
    combineLatest([
      dataService.cfrCampaign(),
      dataService.productsByAge()
    ])
    .subscribe(([metadata, products]) => {
      this.loading = false
      let productGroups: any[]
      const series: any[] = []

      if (!metadata) return
      this.metadata = metadata

      productGroups = Object.values(products.groupBy(p => {return p.podcastShow}))

      for (let i = 0; i < productGroups.length; i++) {
        productGroups[i] = productGroups[i].reduce((allProducts, prod) => {
          let i = allProducts.findIndex((p) => p['age'] === prod['age'])
          if (i == -1) {
            allProducts.push(prod)
          }
          else {
            allProducts[i].metrics.impressions.value += prod.metrics.impressions.value
          }
          return allProducts
        },[])
      }

      productGroups.forEach(productGroup => {this.categories.push(productGroup[0].podcastShow)});

      productGroups.forEach(productGroup => {
        let length = productGroup.length < series.length ? series.length : productGroup.length
        for (let i = 0; i < length; i++) {
          let benchmark = productGroup[i];
          if(series[i] == null || series[i] == undefined) {
            series.push({'name': benchmark.age, 'data': [benchmark.metrics.impressions.value]})
            continue
          }
          benchmark = productGroup.find(({ age }) => age == series[i].name)
          benchmark == undefined || benchmark == null ? series[i].data.push(0) : series[i].data.push(benchmark.metrics.impressions.value)
        }
      })
      this.chartSeries = series
    })
  }
}