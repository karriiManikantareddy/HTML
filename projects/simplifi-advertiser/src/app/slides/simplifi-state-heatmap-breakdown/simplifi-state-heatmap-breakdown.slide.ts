import { Component } from '@angular/core'
import { PostMessageService } from 'projects/template-module/src/lib/services/post-message.service'
import { SimplifiDataService, Region } from '../../services/simplifi-data.service'
import { Subject } from 'rxjs'
import { SimplifiSettingsService } from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-state-heatmap-breakdown',
  templateUrl: './simplifi-state-heatmap-breakdown.slide.html',
  styleUrls: ['./simplifi-state-heatmap-breakdown.slide.less']
})
export class SimplifiStateHeatmapBreakdownSlide {
  loading = true
  regionsByImpressions?: Region[]
  totalImpressions: number
  regionsByClicks?: Region[]
  totalClicks: number
  regionsByOnlineVisits?: Region[]
  totalOnlineVisits: number
  regionsByVisits?: Region[]
  totalVisits: number
  kpis = ['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits']
  impressionsMapSeries: any[]
  clicksMapSeries: any[]
  onlineVisitsMapSeries: any[]
  visitsMapSeries: any[]
  primaryColor: string = '#E05534'
  mapOptions = {
    chart: {
      map: 'countries/us/us-all',
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
      enabled: true,
      formatter: function () {
        return this.point.properties['name'] + ": " + this.point.value
      },
    },
  }
  redraw: Subject<boolean> = new Subject<boolean>()

  constructor(
    dataService: SimplifiDataService,
    settingsService: SimplifiSettingsService,
    private postMessageService: PostMessageService,
    ) {
    postMessageService.addListener('window-resized', this.redrawMap.bind(this))

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
    dataService.simplifiRegionBreakdownItems().subscribe(regions => {
      this.loading = false
      this.regionsByImpressions = regions
        .sortBy(c => -c.metrics.impressions.value)
        .slice(0, 10)
      this.totalImpressions = this.regionsByImpressions.sum(z => z.metrics.impressions.value)
      this.regionsByClicks = regions
        .sortBy(c => -c.metrics.clicks.value)
        .slice(0, 10)
      this.totalClicks = this.regionsByClicks.sum(z => z.metrics.clicks.value)
      this.regionsByOnlineVisits = regions
        .sortBy(c => -c.metrics.online_visits.value)
        .slice(0, 10)
      this.totalOnlineVisits = this.regionsByClicks.sum(z => z.metrics.online_visits.value)
      this.regionsByVisits = regions
        .sortBy(c => -c.metrics.total_visits.value)
        .slice(0, 10)
      this.totalVisits = this.regionsByClicks.sum(z => z.metrics.total_visits.value)
      this.impressionsMapSeries = this.generateSeries(regions, 'impressions')
      this.clicksMapSeries = this.generateSeries(regions, 'clicks')
      this.onlineVisitsMapSeries = this.generateSeries(regions, 'online_visits')
      this.visitsMapSeries = this.generateSeries(regions, 'total_visits')
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

  generateSeries(regions: any, metric: string): any {
    return [{
      data: regions
        .filter(region => region.metrics[metric].value)
        .map(region => {
        return [region.region, region.metrics[metric].value]
      }),
      allAreas: true,
      dataLabels: {
        enabled: true,
        color: '#000',
        formatter: function () {
          return this.name;
        },
        style: {
            fontWeight: 100,
            fontSize: '10px',
            textOutline: 'none'
        },
      },
    }]
  }

  generateName(name, metric) {
    return 'Creative ' + metric + ' ' + name
  }

  redrawMap() {
    if (this.redraw) {
      this.redraw.next(true)
    }
  }
}
