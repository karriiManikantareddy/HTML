import {Component} from '@angular/core'
import {NprDataService} from '../../services/npr-data.service'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less'],
  providers: [DatePipe],
})

export class OverviewSlide {
  loading = true
  totals: any
  currentDateWithYear: string
  currentDate : string

  constructor(
    dataService: NprDataService,
    datePipe: DatePipe
  ) {
    this.currentDateWithYear = datePipe.transform((new Date), 'M/dd/yy')
    this.currentDate = datePipe.transform((new Date), 'M/dd')

    dataService.totals()
    .subscribe(totals => {
      this.loading = false
      this.totals = totals
    })
  }
}