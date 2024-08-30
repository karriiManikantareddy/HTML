import { Component, ChangeDetectorRef } from '@angular/core'
import { PostMessageService } from 'projects/template-module/src/lib/services/post-message.service'
import { Variables } from 'projects/template-module/src/lib/variables'
import { SimplifiDataService, Item, DMA_TRANSLATIONS } from '../../services/simplifi-data.service'
import { Observable, combineLatest, Subject, switchMap, map } from 'rxjs'
import { SimplifiSettingsService } from '../../services/simplifi-settings.service'

@Component({
  selector: 'simplifi-heatmap-breakdown',
  templateUrl: './simplifi-heatmap-breakdown.slide.html',
  styleUrls: ['./simplifi-heatmap-breakdown.slide.less']
})
export class SimplifiHeatmapBreakdownSlide {
  loading = true
  zipsByImpressions?: Item[]
  totalImpressions: number
  zipsByClicks?: Item[]
  totalClicks: number
  zipsByOnlineVisits?: Item[]
  totalOnlineVisits: number
  zipsByVisits?: Item[]
  totalVisits: number
  kpis = ['impressions', 'clicks', 'ctr', 'online_visits', 'total_visits']
  impressionsMapSeries: any[]
  clicksMapSeries: any[]
  onlineVisitsMapSeries: any[]
  visitsMapSeries: any[]
  primaryColor: string = '#E05534'
  mapOptions = {
    chart: {
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
        return this.point.properties['name'] + ", " + this.point.properties['ZIP'] + ": " + this.point.value
      },
    },
  }
  dma: string
  adSeries: any[]
  redraw: Subject<boolean> = new Subject<boolean>()

  constructor(
    private dataService: SimplifiDataService,
    private settingsService: SimplifiSettingsService,
    private postMessageService: PostMessageService,
    ) {
    postMessageService.addListener('window-resized', this.redrawMap.bind(this))

    settingsService.settingData('primaryColor').subscribe(primaryColor => {
      this.primaryColor = primaryColor.data
      Object.merge(this.mapOptions.colorAxis, {
        stops: [
          [0, this.lightenColor(this.primaryColor,'0')],
          [0.5, this.lightenColor(this.primaryColor,'0.5')],
          [1, this.primaryColor],
        ]
      })
      this.redraw.next(true)
    })

    dataService.simplifiTopDma().pipe(
      switchMap(dma => {
        this.dma = dma;
        return this.fetchData(this.dma);
      })
    ).subscribe(data => {
      this.processData(data);
    });

    this.settingsService.settingData('dma').subscribe(dma => {
      this.dma = dma.data;
      this.loading = true;
      this.fetchData(this.dma).subscribe(data => {
        this.processData(data);
      });
    });
  }

  fetchData(dma: string): Observable<{
    zipsByImpressions: Item[],
    zipsByClicks: Item[],
    zipsByOnlineVisits: Item[],
    zipsByTotalVisits: Item[],
    zipsAdImpressions: Item[],
    zipsAdClicks: Item[],
    zipsAdOnlineVisits: Item[],
    zipsAdTotalVisits: Item[],
    dma: string
    }> {
    return combineLatest([
      this.dataService.simplifiZipImpressionsBreakdownItems(dma),
      this.dataService.simplifiZipClicksBreakdownItems(dma),
      this.dataService.simplifiZipOnlineVisitsBreakdownItems(dma),
      this.dataService.simplifiZipTotalVisitsBreakdownItems(dma),
      this.dataService.simplifiAdZipImpressionsBreakdownItems(dma),
      this.dataService.simplifiAdZipClicksBreakdownItems(dma),
      this.dataService.simplifiAdZipOnlineVisitsBreakdownItems(dma),
      this.dataService.simplifiAdZipTotalVisitsBreakdownItems(dma)])
      .pipe(
      map(([
        zipsByImpressions,
        zipsByClicks,
        zipsByOnlineVisits,
        zipsByTotalVisits,
        zipsAdImpressions,
        zipsAdClicks,
        zipsAdOnlineVisits,
        zipsAdTotalVisits,
      ]) => ({
        zipsByImpressions,
        zipsByClicks,
        zipsByOnlineVisits,
        zipsByTotalVisits,
        zipsAdImpressions,
        zipsAdClicks,
        zipsAdOnlineVisits,
        zipsAdTotalVisits,
        dma
      }))
    );
  }

  processData(data: {
    zipsByImpressions: Item[],
    zipsByClicks: Item[],
    zipsByOnlineVisits: Item[],
    zipsByTotalVisits: Item[],
    zipsAdImpressions: Item[],
    zipsAdClicks: Item[],
    zipsAdOnlineVisits: Item[],
    zipsAdTotalVisits: Item[],
    dma: string
    }) {
    this.loading = false;
    this.dma = data.dma;
    Object.merge(this.mapOptions, {
      chart: {
        map: 'countries/us/' + DMA_TRANSLATIONS[this.dma],
      },
    });

    this.zipsByImpressions = data.zipsByImpressions.slice(0, 10);
    this.zipsByClicks = data.zipsByClicks.slice(0, 10);
    this.zipsByOnlineVisits = data.zipsByOnlineVisits.slice(0, 10);
    this.zipsByVisits = data.zipsByTotalVisits.slice(0, 10);
    this.totalImpressions = this.zipsByImpressions.sum(z => z.metrics.impressions.value)
    this.totalClicks = this.zipsByClicks.sum(z => z.metrics.clicks.value)
    this.totalOnlineVisits = this.zipsByOnlineVisits.sum(z => z.metrics.online_visits.value)
    this.totalVisits = this.zipsByVisits.sum(z => z.metrics.total_visits.value)
    this.impressionsMapSeries = this.generateSeries(data.zipsByImpressions, 'impressions')
    this.clicksMapSeries = this.generateSeries(data.zipsByClicks, 'clicks')
    this.onlineVisitsMapSeries = this.generateSeries(data.zipsByOnlineVisits, 'online_visits')
    this.visitsMapSeries = this.generateSeries(data.zipsByTotalVisits, 'total_visits')
    this.adSeries = this.generateAdSeries(data.zipsAdImpressions, data.zipsAdClicks, data.zipsAdOnlineVisits, data.zipsAdTotalVisits);

    Object.merge(this.mapOptions.colorAxis, {
      stops: [
        [0, this.lightenColor(this.primaryColor,'0')],
        [0.5, this.lightenColor(this.primaryColor,'0.5')],
        [1, this.primaryColor],
      ]
    })
    setTimeout(() => {
      this.redraw.next(true)
    }, 3000)
  }

  generateSeries(zips: any, metric: string): any {
    return [{
      data: zips
        .filter(zip => zip.metrics[metric].value)
        .map(zip => {
        return [zip.name, zip.metrics[metric].value]
      }),
      keys: ['ZIP', 'value'],
      joinBy: 'ZIP',
      allAreas: true,
      dataLabels: {
        enabled: true,
        color: '#000',
        formatter: function () {
          return this.point.properties && this.point.properties['ZIP'] || this.name;
        },
        style: {
          fontWeight: 100,
          fontSize: '10px',
          textOutline: 'none'
        },
      },
    }]
  }

  generateAdSeries(
    zipsAdImpressions: any[],
    zipsAdClicks: any[],
    zipsAdOnlineVisits: any[],
    zipsAdTotalVisits: any[]
  ): any[] {
    const mergedZips = [
      ...zipsAdImpressions.map(zip => ({ ...zip, type: 'impressions' })),
      ...zipsAdClicks.map(zip => ({ ...zip, type: 'clicks' })),
      ...zipsAdOnlineVisits.map(zip => ({ ...zip, type: 'online_visits' })),
      ...zipsAdTotalVisits.map(zip => ({ ...zip, type: 'total_visits' }))
    ];

    const zipGroups: { [key: string]: { [key: string]: any[] } } = {};
    mergedZips.forEach(zip => {
      const ad = zip.parent['ad'];
      const type = zip.type;
      if (!zipGroups[ad]) {
        zipGroups[ad] = {
          impressions: [],
          clicks: [],
          online_visits: [],
          total_visits: []
        };
      }
      zipGroups[ad][type].push(zip);
    });

    const adSeries = Object.keys(zipGroups).map((ad: string) => {
      const group = zipGroups[ad];
      return {
        ad,
        impressionsData: this.generateSeries(group.impressions, 'impressions'),
        clicksData: this.generateSeries(group.clicks, 'clicks'),
        onlineVisitsData: this.generateSeries(group.online_visits, 'online_visits'),
        visitsData: this.generateSeries(group.total_visits, 'total_visits'),
        zipByImpressionsData: group.impressions.slice(0, 10),
        zipByClicksData: group.clicks.slice(0, 10),
        zipByOnlineVisits: group.online_visits.slice(0, 10),
        zipByVisitsData: group.total_visits.slice(0, 10)
      };
    });
    return adSeries.slice(0, 5);
  }

  generateName(name, metric) {
    return metric + ' ' + name
  }

  redrawMap() {
    if (this.redraw) {
      this.redraw.next(true)
    }
  }

  lightenColor(color, amount) {
    color = color.toLowerCase();
    const lighterShades = {
      '0' : {
        '#ff0000': '#fce7fb',
        '#21fc02': '#edfeeb',
        '#0000ff': '#ecfcff',
        '#e05534': '#fbefda'
      },
      '0.5' : {
        '#ff0000': '#fc8a8b',
        '#21fc02': '#b5feb6',
        '#0000ff': '#8485ff',
        '#e05534': '#e08c6e'
      }
    };
    return lighterShades[amount][color] || color;
  }

}
