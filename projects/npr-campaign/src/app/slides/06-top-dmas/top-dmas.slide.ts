import {Component} from '@angular/core'
import {NprDataService, Metadata, Region} from '../../services/npr-data.service'
import { DatePipe } from '@angular/common'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'top-dmas',
  templateUrl: './top-dmas.slide.html',
  styleUrls: ['./top-dmas.slide.less'],
  providers: [DatePipe],
})
export class TopDMAsSlide {
  loading = true
  metadata: Metadata
  currentDate : string
  topRegions: Region[]

  constructor(dataService: NprDataService, datePipe: DatePipe) {
    this.currentDate = datePipe.transform((new Date), 'M/dd/yy')

    combineLatest([
      dataService.cfrCampaign(),
      dataService.regions(),
    ])
    .subscribe(([metadata, regions]) => {
      this.loading = false
      if (!metadata) return
      this.metadata = metadata

      if (!regions || !regions.length) return
      this.topRegions = regions
      .sortBy('metrics.impressions.value', true)
      .slice(0,5)
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
}