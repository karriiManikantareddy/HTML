import {Component, Input, OnInit} from '@angular/core'
import {forkJoin} from 'rxjs'
import {NytDataService, DfpCreative} from '../../services/nyt-data.service'
import {MetricChangeEvent} from './creative-top/creative-top.component'

@Component({
  selector: 'top-creatives',
  templateUrl: './top-creatives.slide.html',
  styleUrls: ['./top-creatives.slide.less']
})
export class TopCreativesSlide implements OnInit {
  loading = true
  creativeGroups: DfpCreative[][] = [[]]
  totalMetrics: Partial<Record<string, number>> = {}

  private topCreatives: DfpCreative[]
  private totalsMetricsExcludingTop: Record<string, number> = {}
  @Input() costType: 'CPM' | 'CPD'
  name: string

  constructor(
    private dataService: NytDataService,
  ) {}

  ngOnInit(): void {
    if (this.costType === 'CPM') {
      this.name = 'Top Rotational Creative'
    } else if (this.costType === 'CPD') {
      this.name = 'Top Fixed Placement Creative'
    }
    forkJoin([
      this.dataService.creatives(),
      this.dataService.totals()
    ]).subscribe(([allCreatives, totals]) => {
      this.loading = false
      const creatives = allCreatives
        .filter(c => c.costType === this.costType)
        .filter(c => c.metrics.dfp_total_line_item_level_all_revenue !== 0)
        .filter(c => c.name != null)

      const uniqueCreatives: Partial<Record<string,DfpCreative>> = {}
      for (const c of creatives) {
        const key = `${c.name.replace(/\s\(copy\)+/g, '')} ${c.lineItemName}`
        const previousCreative = uniqueCreatives[key]
        const previousMetrics = previousCreative && previousCreative.metrics || {}
        uniqueCreatives[key] = {
          name: c.name.replace(/\s\(copy\)+/g, ''),
          id: key.replace(/\//g, ''),
          previewUrl: c.previewUrl,
          height: c.height,
          width: c.width,
          lineItemName: c.lineItemName,
          metrics: {
            dfp_total_line_item_level_impressions: (c.metrics.dfp_total_line_item_level_impressions || 0) + (previousMetrics.dfp_total_line_item_level_impressions || 0),
            dfp_total_line_item_level_clicks: (c.metrics.dfp_total_line_item_level_clicks || 0) + (previousMetrics.dfp_total_line_item_level_clicks || 0),
            dfp_ctr: ((c.metrics.dfp_total_line_item_level_clicks || 0 )+ (previousMetrics.dfp_total_line_item_level_clicks || 0)) / ((c.metrics.dfp_total_line_item_level_impressions || 0) + (previousMetrics.dfp_total_line_item_level_impressions || 0)),
            dfp_total_active_view_viewable_impressions: (c.metrics.dfp_total_active_view_viewable_impressions || 0) + (previousMetrics.dfp_total_active_view_viewable_impressions || 0),
            dfp_total_active_view_measurable_impressions: (c.metrics.dfp_total_active_view_measurable_impressions || 0) + (previousMetrics.dfp_total_active_view_measurable_impressions || 0),
            dfp_total_active_view_viewable_impressions_rate: ((c.metrics.dfp_total_active_view_viewable_impressions || 0) + (previousMetrics.dfp_total_active_view_viewable_impressions || 0)) / ((c.metrics.dfp_total_active_view_measurable_impressions || 0) + (previousMetrics.dfp_total_active_view_measurable_impressions || 0)),
          }
        }
      }

      const topCreatives = Object.values<DfpCreative>(uniqueCreatives)
        .sortBy(creative => {
          return creative.metrics.dfp_total_line_item_level_clicks || 0
        }, true)
        .slice(0, 4)

      if (topCreatives.length === 0) {
        return
      }

      const totalMetrics = {}
      totalMetrics['dfp_total_line_item_level_impressions'] =  totals && totals.dfp_total_line_item_level_impressions || 0
      totalMetrics['dfp_total_line_item_level_clicks'] =  totals && totals.dfp_total_line_item_level_clicks || 0

      const totalsExcludingTop = {}
      totalsExcludingTop['dfp_total_line_item_level_impressions'] = totalMetrics['dfp_total_line_item_level_impressions'] -
        topCreatives.sum(creative => creative.metrics['dfp_total_line_item_level_impressions'] || 0)
      totalsExcludingTop['dfp_total_line_item_level_clicks'] = totalMetrics['dfp_total_line_item_level_clicks'] -
        topCreatives.sum(creative => creative.metrics['dfp_total_line_item_level_clicks'] || 0)

      this.totalMetrics = totalMetrics
      this.totalsMetricsExcludingTop = totalsExcludingTop
      this.topCreatives = topCreatives
      this.creativeGroups = topCreatives
        .inGroupsOf(2)
        .map('compact')
    })
  }

  creativeChanged(data: MetricChangeEvent) {
    const changedCreative = this.topCreatives.find(creative => creative.name === data.creativeName)
    changedCreative.metrics[data.metric] = data.value
    const impressions = changedCreative.metrics.dfp_total_line_item_level_impressions
    const clicks = changedCreative.metrics.dfp_total_line_item_level_clicks
    changedCreative.metrics.dfp_ctr = impressions ? clicks / impressions : undefined
    this.totalMetrics = this.recalculateTotals(this.totalsMetricsExcludingTop, this.topCreatives)
  }

  private recalculateTotals(totalsWithoutTop: Record<string, number>, topCreatives: DfpCreative[]): Record<string, number> {
    const totals = Object.clone(totalsWithoutTop, true) as Record<string, number>
    totals.dfp_total_line_item_level_impressions += topCreatives.sum(creative => creative.metrics.dfp_total_line_item_level_impressions)
    totals.dfp_total_line_item_level_clicks += topCreatives.sum(creative => creative.metrics.dfp_total_line_item_level_clicks)
    return totals
  }

  static DEFAULT_OPTIONS = {
    HEIGHT: 160,
    IMPRESSION_COLOR: '#48ABDF',
    CLICKS_COLOR: '#9F2BDD',
    SECONDARY_COLOR: 'rgb(234, 240, 244)',
    INNER_SIZE: '90%'
  }
  static CLICKS_PALLET = [TopCreativesSlide.DEFAULT_OPTIONS.CLICKS_COLOR, TopCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];
  static IMPRESSION_PALLET = [TopCreativesSlide.DEFAULT_OPTIONS.IMPRESSION_COLOR, TopCreativesSlide.DEFAULT_OPTIONS.SECONDARY_COLOR];

  pieSeries = [{
    innerSize: TopCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
    data: [
      ['Total', 20],
      {
        name: '',
        y: 80,
        dataLabels: {
          enabled: false
        }
      }
    ]
  }]

  purplePieSeries = [{
    innerSize: TopCreativesSlide.DEFAULT_OPTIONS.INNER_SIZE,
    data: [
      ['Total', 25],
      {
        name: '',
        y: 75,
        dataLabels: {
          enabled: false
        }
      }
    ]
  }]

  pieOptions = {
    chart: {
      height: TopCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: TopCreativesSlide.IMPRESSION_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false
        }
      }
    }
  }

  purplePieOptions = {
    chart: {
      height: TopCreativesSlide.DEFAULT_OPTIONS.HEIGHT
    },
    colors: TopCreativesSlide.CLICKS_PALLET,
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      }
    }
  }
}
