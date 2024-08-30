import {Component} from '@angular/core'
import {NprDataService, Metadata, Platform} from '../../services/npr-data.service'
import { DatePipe } from '@angular/common'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'devices',
  templateUrl: './devices.slide.html',
  styleUrls: ['./devices.slide.less'],
  providers: [DatePipe],
})
export class DevicesSlide {
  loading = true
  metadata: Metadata
  platforms: Platform[]
  currentDate : string

  constructor(dataService: NprDataService, datePipe: DatePipe) {
    this.currentDate = datePipe.transform((new Date), 'M/dd/yy')

    combineLatest([
      dataService.cfrCampaign(),
      dataService.platforms(),
    ])
    .subscribe(([metadata, platforms]) => {
      this.loading = false

      if (!metadata) return
      this.metadata =  metadata

      if (!platforms) return
      this.platforms = platforms
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