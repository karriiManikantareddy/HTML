import { Component } from '@angular/core';
import { PostMessageService } from 'projects/template-module/src/lib/services/post-message.service';
import { SimplifiDataService, Item } from '../../services/simplifi-data.service';
import { Subject } from 'rxjs';
import { SimplifiSettingsService } from '../../services/simplifi-settings.service';
@Component({
  selector: 'facebook-dma',
  templateUrl: './facebook-dma.component.html',
})
export class FacebookDmaComponent {
  loading = true;
  kpis: string[] = ['impressions', 'link_clicks', 'link_click_ctr'];
  impressionMapSeries: any[];
  clicksMapSeries: any[];
  ctrMapSeries: any[];
  topImpressionsMetros: Item[];
  topClicksMetros: Item[];
  topCtrMetros: Item[];
  mapOptions = {
    chart: {
      map: 'countries/us/us-dma-city',
      style: {
        color: '#949497',
        fontFamily: 'helvetica',
        fontSize: '14px',
        height: '800px',
        verticalAlign: 'top',
      },
    },
    colorAxis: {
      type: 'linear',
      startOnTick: false,
      endOnTick: false,
    },
    tooltip: {
      enabled: false,
      formatter: function () {
        return this.point.properties['name'] + ": " + this.point.value
      },
    },
  }
  primaryColor: string = '#E05534'
  redraw: Subject<boolean> = new Subject<boolean>();

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    private postMessageService: PostMessageService,
    ) {
    postMessageService.addListener('window-resized', this.redrawMap.bind(this));

    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
      Object.merge(this.mapOptions.colorAxis, {
        stops: [
          [0, '#fff'],
          [1, this.primaryColor],
        ]
      })
      this.redraw.next(true)
    })
    dataService.facebookDma().subscribe(metros => {
      this.loading = false;
      this.impressionMapSeries = [{
        data: metros
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            return [metro.name, metro.metrics.impressions.value]
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }];
      this.clicksMapSeries = [{
        data: metros
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            return [metro.name, metro.metrics.link_clicks.value]
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }];
      this.ctrMapSeries = [{
        data: metros
          .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
          .map(metro => {
            return [metro.name, metro.metrics.link_click_ctr.value]
          }),
        keys: ['dma1', 'value'],
        joinBy: 'dma1',
      }];
      this.topImpressionsMetros = metros
        .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10);
      this.topClicksMetros = metros
        .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
        .sortBy(c => -c.metrics.link_clicks.value)
        .slice(0, 10);
      this.topCtrMetros = metros
        .filter(m => !m.name.isEmpty() && m.name !== 'n/a')
        .sortBy(c => -c.metrics.link_click_ctr.value)
        .slice(0, 10);
      Object.merge(this.mapOptions.colorAxis, {
        stops: [
          [0, '#fff'],
          [1, this.primaryColor],
        ]
      })
      setTimeout(() => {
        this.redraw.next(true)
      }, 3000)
    })
  }

  redrawMap() {
    if (this.redraw) {
      this.redraw.next(true);
    }
  }
}
