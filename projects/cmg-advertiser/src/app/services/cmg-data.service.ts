import {Observable} from 'rxjs'
import { MetricValue, ChartSeries } from 'projects/template-module/src/lib/services/result.model'

export interface Dates {
  startDate?: string
  endDate?: string
}

export interface LegendItem {
  name?: string
  color?: string
}

export interface ChartConfig {
  metric?: string
  spline?: string[]
}

export abstract class CmgDataService {
  abstract metadata(): Observable<Metadata>
  abstract amazonDisplayOverview(): Observable<Overview>
  abstract amazonOttOverview(): Observable<Overview>
  abstract googleAdsOverview(): Observable<Overview>
  abstract bingOverview(): Observable<Overview>
  abstract facebookAdsOverview(): Observable<Overview>
  abstract groundtruthOverview(): Observable<Overview>
  abstract birdeyeOverview(): Observable<Overview>
  abstract elToroOverview(): Observable<Overview>
  abstract gamutOverview(): Observable<Overview>
  abstract marchexOverview(): Observable<Overview>
  abstract yextOverview(): Observable<Overview>
  abstract speedshiftOverview(): Observable<Overview>
  abstract brightedgeOverview(): Observable<Overview>
  abstract siteImpactOverview(): Observable<Overview>
  abstract dv360VideoOverview(): Observable<Overview>
  abstract dv360DisplayOverview(): Observable<Overview>
  abstract googleAdManagerVideoOverview(): Observable<Overview>
  abstract googleAdManagerDisplayOverview(): Observable<Overview>
  abstract doohVistarOverview(): Observable<Overview>
  abstract audienceExtensionAudio(): Observable<Overview>
  abstract ooAudioStreaming(): Observable<Overview>
  abstract prerollOverview(): Observable<Overview>
  abstract semrushDomainOverview(): Observable<Overview>
  dates: Dates

  constructor(private window: any) {
    this.dates = this.datesFromInterval(location)
  }

  updateDates(startDate: string, endDate: string) {
    if (this.dates.startDate == null || startDate > this.dates.startDate) {
      this.dates.startDate = startDate
    }

    if (this.dates.endDate == null || endDate < this.dates.endDate) {
      this.dates.endDate = endDate
    }
  }

  private datesFromInterval(location): Dates {
    const params = <any> Object.fromQueryString(location.search)
    const interval = params['interval']
    if (interval == null) {
      return {}
    } else {
      const parts = interval.toString().split('-')
      return {
        startDate: parts[0],
        endDate: parts[1],
      }
    }
  }
}

export class Metadata {
  public readonly startDate: string
  public readonly endDate: string

  constructor(
    public readonly name: string,
    readonly dates: Dates = null
  ) {
    this.startDate = dates.startDate
    this.endDate = dates.endDate
  }
}

export class Overview {
  public readonly advertiserName: string
  public readonly name: string
  public readonly metrics: MetricValue[]
  public readonly series: ChartSeries[]
  public readonly legendItems: LegendItem[] = []
  public readonly chartOptions: any = {
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      labels: {
        formatter: function() {
          return Date.create(this.value).format('{Mon} {date}')
        }
      }
    },
    yAxis: []
  }

  constructor(advertiserName, datasourceId, name, metrics, series) {
    this.advertiserName = advertiserName
    this.name = name
    this.metrics = metrics
    const chartConfig: ChartConfig = chartConfigBySource[datasourceId]
    this.series = series.map(s => {
      const metric = this.metrics.find(m => m.name == s['name'])
      const splineIndex = chartConfig.spline.findIndex(m => m === (s['name']))
      if (chartConfig.metric == s['name']) {
        this.legendItems.push({name: metric.displayName, color: '#006384'})
        this.chartOptions['yAxis'].push({})
        return Object.add(s, {
          color: '#006384',
        })
      } else if (splineIndex !== -1) {
        const color = splineColors[(splineIndex % 3)]
        this.legendItems.push({name: metric.displayName, color: color})
        let yAxis = { opposite: true, title: null }
        if (metric.format.format == 'percent') {
          yAxis['labels'] = {
            formatter: function() {
              return `${(this.value * 100).round(3)}%`
            }
          }
        }
        this.chartOptions['yAxis'].push(yAxis)
        return Object.add(s, {
          color: color,
          type: 'line',
          yAxis: (splineIndex + 1),
        })
      }
    }).compact()
  }
}

const splineColors: string[] = ['#28aae2', '#f25923', '#ebecec']

const chartConfigBySource = {
  mapped_seed_amazon_dsp_display: {
    metric: 'impressions',
    spline: ['click_throughs', 'ctr'],
  },
  dm_mapped_seed_google_ads: {
    metric: 'clicks',
    spline: ['click_rate'],
  },
  dm_mapped_seed_bing: {
    metric: 'clicks',
    spline: ['click_rate'],
  },
  dm_mapped_seed_birdeye: {
    metric: 'reviews',
    spline: ['avg_sentiment', 'rating_sum'],
  },
  mapped_seed_google_ad_manager_display: {
    metric: 'total_line_item_level_impressions',
    spline: ['total_line_item_level_clicks', 'click_rate'],
  },
  mapped_seed_google_ad_manager_video: {
    metric: 'total_line_item_level_impressions',
    spline: ['video_viewership_complete', 'vcr'],
  },
  mapped_seed_dv360_display: {
    metric: 'impressions',
    spline: ['clicks', 'click_rate'],
  },
  mapped_seed_dv360_video: {
    metric: 'impressions',
    spline: ['complete_views_video', 'vcr'],
  },
  mapped_seed_amazon_dsp_ott: {
    metric: 'impressions',
    spline: ['video_complete', 'vcr'],
  },
  dm_mapped_seed_el_toro: {
    metric: 'imps',
    spline: ['clicks', 'click_rate'],
  },
  dm_mapped_seed_gamut: {
    metric: 'impressions',
    spline: ['video_completes', 'video_completion_rate'],
  },
  mapped_marchex_combined: {
    metric: 'calls',
    spline: ['average_duration'],
  },
  dm_mapped_speedshift: {
    metric: 'impressions',
    spline: ['clicks_delivered', 'click_rate'],
  },
  dm_mapped_groundtruth: {
    metric: 'impressions',
    spline: ['click_rate'],
  },
  dm_mapped_seed_yext: {
    metric: 'searches',
    spline: ['profile_views', 'yelp_page_views'],
  },
  dm_mapped_seed_facebook_ads: {
    metric: 'impressions',
    spline: ['link_clicks', 'link_clicks_ctr'],
  },
  dm_mapped_seed_site_impact: {
    metric: 'quantity',
    spline: ['open_rate'],
  },
  dm_mapped_seed_brightedge: {
    metric: 'impressions',
    spline: ['clicks']
  },
  mapped_seed_dv360_audio: {
    metric: 'impressions',
    spline: ['clicks', 'audio_completion_rate']
  },
  dm_mapped_cfr_adswizz: {
    metric: 'impressions',
    spline: ['listen_through_rate']
  },
  dm_mapped_seed_vistar: {
    metric: 'impressions',
    spline: ['client_revenue', 'fixed_ecpm']
  },
  mapped_seed_google_ad_manager_preroll: {
    metric: 'total_line_item_level_impressions',
    spline: ['total_line_item_level_clicks', 'click_rate']
  },
  mapped_seed_semrush: {
    metric: 'organic_keywords',
    spline: ['organic_traffic']
  },
}
