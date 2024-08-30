import {Component, Inject, LOCALE_ID} from '@angular/core';
import {Variables} from 'projects/template-module/src/lib/variables';
import {SimplifiDataService, Item} from '../../services/simplifi-data.service';
import {SimplifiSettingsService} from '../../services/simplifi-settings.service';
import {NumberPipe} from 'projects/template-module/src/lib/pipes/number.pipe';

@Component({
  selector: 'facebook-platform',
  templateUrl: './facebook-platform.component.html',
})
export class FacebookPlatformComponent {
  loading = true;
  kpis = ['impressions', 'link_clicks', 'link_click_ctr'];
  series: any[];
  legendItems: any[] = [];
  numberPipe: NumberPipe;
  options: any = {
    chart: {
      height: 800,
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
  };
  primaryColor: string = '#E05534';
  theme: string = 'dark';
  filteredDevices: any;
  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    variables: Variables,
    @Inject(LOCALE_ID) locale: string,
  ) {
      const __this = this;
      this.numberPipe = new NumberPipe(locale);
      this.options['plotOptions']['series']['dataLabels']['formatter'] = function() {
        return `<b>${this.point.name}:</b> ${__this.numberPipe.transform(this.point.y, {separatorName: 'comma'})}`
      }
      dataService.facebookPlatforms().subscribe(devices => {
      this.loading = false;
      this.options = Object.add(this.options, {colors: variables.colors[this.theme].chart});
      this.filteredDevices = devices
        .filter(d => d.metrics.impressions.value > 1000)
        .sortBy(c => -c.metrics.link_clicks.value);
      this.series = [{
        type: 'pie',
        name: 'Platform Distribution',
        size: '60%',
        data: this.filteredDevices.map(device => { return { name: device.name, y: device.metrics.impressions.value }}),
      }];
      
      this.filteredDevices.forEach((channel, i) => {
        this.legendItems.push({name: channel.name, color: variables.colors[this.theme].chart[i]})
      });
    })
    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
    });
    settingsService.settingData('theme').subscribe(theme => {
      this.theme = theme.data
    });
  }
}
