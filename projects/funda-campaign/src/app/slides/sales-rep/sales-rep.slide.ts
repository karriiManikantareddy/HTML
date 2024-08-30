import { Component } from '@angular/core'
import { SettingsService } from '../../services/settings.service'
import { combineLatest } from 'rxjs'
import { FundaDataService } from '../../services/funda-data.service'

@Component({
  selector: 'sales-rep',
  templateUrl: './sales-rep.slide.html',
  styleUrls: ['./sales-rep.slide.less'],
})
export class SalesRepSlide {
  align: string = 'left';
  templateType = 'consumers'
  salesRep: {
    fullName: string
    firstName: string
    email: string
    phone: string
    imageUrl: string
  } = {} as any

  constructor(settingsService: SettingsService, dataService: FundaDataService) {
    combineLatest<any>([
      settingsService.settingData('template-type'),
      dataService.dfpSalesPerson(),
    ]).subscribe(([templateType, salesPerson]) => {
      const imageUrl = `assets/img/${
        salesPerson.name &&
        salesPerson.name.toLowerCase().split(' ').join('-')
      }.png`
      this.salesRep = {
        fullName: salesPerson.name,
        firstName:
          salesPerson.name &&
          salesPerson.name.split(' ')[0],
        email: salesPerson.email,
        phone: salesPerson.mobilePhone,
        imageUrl,
      }
      this.templateType = templateType && templateType.data
    })
  }
}
