import {Subscription, combineLatest} from 'rxjs';
import {Component, Input, OnDestroy} from '@angular/core';
import {NytDataService, Metadata, LineItem} from '../../services/nyt-data.service';
import {ChartSeries} from 'projects/template-module/src/lib/services/result.model';
import {Variables} from 'projects/template-module/src/lib/variables';
import {TemplateService} from 'projects/template-module/src/lib/services/template.service';
import { NytSettingsService } from '../../services/nyt-settings.service';


@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide implements OnDestroy {
  loading = true;
  totals: Partial<Readonly<Record<string, number>>> = {};
  chartSeries: ChartSeries[] = [];
  useThirdParty = false;
  metricType: 'first' | 'third' | 'both' = 'both';
  cpmLineItems: Partial<Record<string, number>>  = {};
  cpdLineItems: Partial<Record<string, number>>  = {};
  subscription: Subscription;
  @Input() backgroundColor: string;
  @Input() fontStyling: string;

  chartOptions = {
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function(this: {value: number}) {
          return Date.create(this.value).format('{Mon} {date}')
        }
      }
    },
    yAxis: [
      {},
      {
        title: null,
        opposite: true,
        labels: {
          formatter: function f(this: {value: number}): string {
            return `${(this.value * 100).round(3)}%`
          }
        }
      }
    ]
  };
  legendItems: any[];

  constructor(
    settingsState: NytSettingsService,
    dataService: NytDataService,
    variables: Variables,
    settingsService: NytSettingsService,
  ) {
    this.subscription = combineLatest([
      settingsState.settingData('metricTypes'),
      dataService.totals(),
      dataService.series(),
      dataService.lineItems(),
      settingsService.settingData('colorTheme'),
    ])
    .subscribe(([metricTypeSetting, totals, series, lineItems, theme]) => {
      if (metricTypeSetting === null) {
        console.warn('metricTypeSetting is null/undefined')
      } else if (metricTypeSetting.data) {
        this.metricType = metricTypeSetting.data
      }
      const colors = variables.colors.themes[theme.data]
      this.loading = false
      this.totals = totals
      this.chartSeries = series.map(s => {
          if (s.name === 'dfp_total_line_item_level_impressions') {
            return <ChartSeries> Object.add(s, {color: colors.secondary})
          } else if (s.name === 'dfp_ctr') {
            return <ChartSeries> Object.add(s, {
              type: 'line',
              yAxis: 1,
              color: colors.primary,
            })
          } else {
            return s
          }
      })

      this.cpmLineItems.bookedImpressions = this.addLineItemData('CPM', 'bookedImpressions', lineItems);
      this.cpmLineItems.dfp_total_line_item_level_impressions = this.addLineItemData('CPM', 'dfp_total_line_item_level_impressions', lineItems);
      this.cpmLineItems.dr_third_party_impressions = this.addLineItemData('CPM', 'dr_third_party_impressions', lineItems);
      this.cpdLineItems.dfp_total_line_item_level_impressions = this.addLineItemData('CPD', 'dfp_total_line_item_level_impressions', lineItems);
      this.cpdLineItems.dr_third_party_impressions = this.addLineItemData('CPD', 'dr_third_party_impressions', lineItems);

      if (this.cpmLineItems.bookedImpressions) {
        this.cpmLineItems.total_ctr = (this.cpmLineItems.dfp_total_line_item_level_impressions || 0) / this.cpmLineItems.bookedImpressions
        this.cpmLineItems.total_third_party_ctr = (this.cpmLineItems.dr_third_party_impressions || 0) / this.cpmLineItems.bookedImpressions
      }

      this.legendItems = [
        {name: 'impressions', color: colors.secondary},
        {name: 'ctr', color: colors.primary},
      ]
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addLineItemData(costType: string, metric: string, lineItems: LineItem[]): number {
    return lineItems.filter(lineItem => lineItem.costType === costType).reduce((sum, curr) => {
      return metric === 'bookedImpressions' ? sum + Number(curr[metric]) : sum + Number(curr.metrics[metric]);
    }, 0);
  }

  iconChecker(element1,element2):boolean {
    const isThirdMetricVisible = this.isElementVisible(element1);
    const isFirstMetricVisible = this.isElementVisible(element2);
    return isFirstMetricVisible || isThirdMetricVisible;
  }

  isElementVisible(elementName: string): boolean {
    const element = document.querySelector(`div[name="${elementName}"]`) as HTMLElement;
    return element && getComputedStyle(element).display !== "none";
  }

}
