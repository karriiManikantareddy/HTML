import {Component, Inject, LOCALE_ID} from '@angular/core'
import {combineLatest} from 'rxjs'
import {Variables} from 'projects/template-module/src/lib/variables'
import {SimplifiDataService} from '../../services/simplifi-data.service'
import {SimplifiSettingsService} from '../../services/simplifi-settings.service'
import {NumberPipe} from 'projects/template-module/src/lib/pipes/number.pipe'

@Component({
  selector: 'facebook-demographics',
  templateUrl: './facebook-demographics.slide.html',
  styleUrls: ['./facebook-demographics.slide.less'],
})
export class FacebookDemographicsSlide {
  loading = true
  ageSeries: any[]
  genderSeries: any[]
  numberPipe: NumberPipe
  options: any = {
    chart: {
      height: 400,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: 18.5,
          },
        },
      },
    },
  }
  primaryColor: string = '#E05534'
  theme: string = 'dark'
  filteredAges: any;
  filteredGenders: any;
  kpis = ['impressions', 'link_clicks', 'link_click_ctr'];

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
    @Inject(LOCALE_ID) locale: string,
  ) {
    combineLatest([
      dataService.facebookAges(),
      dataService.facebookGenders(),
    ]).subscribe(([ages, genders]) => {
      this.loading = false
      this.options = Object.add(this.options, {colors: variables.colors[this.theme].chart})
      this.filteredAges = ages.filter(d => d.metrics.impressions.value > 1000);
      this.ageSeries = [{
        type: 'pie',
        name: 'Age Distribution',
        size: '100%',
        data: this.filteredAges.map(device => { return { name: device.name, y: device.metrics.impressions.value }}),
      }]
      this.filteredGenders = genders.filter(d => d.metrics.impressions.value > 1000);
      this.genderSeries = [{
        type: 'pie',
        name: 'Gender Distribution',
        size: '100%',
        data: this.filteredGenders.map(device => { return { name: device.name, y: device.metrics.impressions.value }}),
      }]
    })
    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
    })
    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
    })
  }
}
