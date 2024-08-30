import {forkJoin, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { DataService } from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {
  CbsiDataService,
  Metadata,
  LineItem,
  Creative,
  Packages,
  PackageCreatives,
  PackagesByDay,
} from './cbsi-data.service'
import { MetricValues } from '../../../../template-module/src/lib/services/result.model'
import { Metric } from '../../../../template-module/src/lib/services/schema.model'
import { SkipItems } from '../variables'

export * from './cbsi-data.service'

@Injectable()
export class CampaignDataService extends CbsiDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
  ) {
    super(window)
  }

  metadata() {
    return this.dataService
      .load('billing_combiner_campaign_metadata')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const row = (result && result.rows || [])[0]
          if (row) {
            const advertiser = row.getData('operative_advertiser').operative_advertiser
            const operativeSalesOrder = row.getData('operative_sales_order')
            const campaign = row.getData('campaign')
            this.dates.startDate = campaign['start_date']
            this.dates.endDate = campaign['end_date']
            return new Metadata(
              advertiser,
              campaign,
              operativeSalesOrder,
              this.dates,
            )
          }
        })
      )
  }

  totals() {
    return this.dataService
      .load('billing_combiner_campaign')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          if (!result) return
          const row = result.rows[0]
          if (!row) return
          const totals = this.metricsToHash(row.metrics)
          totals['ctr'] = totals['billable_clicks'] / totals['billable_impressions']
          totals['dfp_ctr'] = totals['dfp_clicks'] / totals['dfp_impressions']
          return totals
        })
      )
  }

  lineItems() {
    return this.dataService
      .load('billing_combiner_line_item')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const lineItems = (result && result.rows || []).map(row => {
            const data = row.getData('line_item')
            const metrics = this.metricsToHash(row.metrics)
            const calculatedCost = this.dataCostTypes(data.cost_type, metrics, data)
            let universalRate = metrics.moat_universal_interactions / metrics.moat_impressions_analyzed
            let ctr = metrics.billable_clicks / metrics.billable_impressions
            metrics['bookedBillableRevenue'] = calculatedCost.bookedBillRev
            metrics['deliveredBillableRevenue'] = calculatedCost.deliveredBillRev
            metrics['rbp_billable_imps'] = data.fw_enable_dar_new_calculation === 'true'  ? Number(metrics.rbp_billable_imps) || 0 : Number(metrics.billable_impressions) || 0;
            data['universalInteractionRate'] = !universalRate ? 0 : universalRate
            data['ctr'] = !ctr ? 0 : ctr
            data['vcr'] = metrics.dfp_video_complete / metrics.dfp_video_start
            return new LineItem(metrics, data)
          })
          return lineItems.filter(item => {
            if (SkipItems.some(match => item.data.line_item.includes(match))) {
              return false
            }
            return item
          })
        })
      )
  }

  packages() {
    return this.dataService
      .load('billing_combiner_line_item')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const packageList = (result && result.rows || []).map(row => {
            const operativeLineItemData = row.getData('operative_line_item')
            const data = row.getData('line_item')
            const packageName = operativeLineItemData['io_package_name'] !== null
              ? operativeLineItemData['io_package_name']
              : 'N/A'
            const metrics = this.metricsToHash(row.metrics)
            const calculatedCost = this.dataCostTypes(data.cost_type, metrics, data)
            data['deliveredBillableRevenue'] = calculatedCost.deliveredBillRev
            data['bookedBillableRevenue'] = calculatedCost.bookedBillRev
            return new Packages(packageName, metrics, data)
          })
          const groupedPackage = packageList
            .filter(item => {
              if (SkipItems.some(match => item.data.line_item.includes(match))) return false
              return item
            }).groupBy(p => p.name)
          return Object.keys(groupedPackage).map(key => {
            const metrics = {}, data = {}, packageName = String(key), uniquePackages = groupedPackage[packageName]
            const dates = this.extremeDates(uniquePackages)
            data['start_date'] = dates.earliestDate == 0 ? null : String(dates.earliestDate)
            data['end_date'] = dates.latestDate == 0 ? null : String(dates.latestDate)
            data['goal_quantity'] = uniquePackages.sum(p => p.data.goal_quantity || 0)
            data['operative_quantity'] = uniquePackages.sum(p => Number(p.data.operative_quantity) || 0)
            data['operative_net_unit_cost'] = Number(uniquePackages[0].data.operative_net_unit_cost) || 0
            data['imp_goal'] = uniquePackages.sum(p =>
              p.data.operative_cost_type === 'CPM'
                ? Number(p.data.operative_quantity)
                : 0
            )
            data['spend_goal'] = uniquePackages.sum(p => p.data.operative_quantity * p.data.operative_net_unit_cost / 1000)
            data['delivered_spend_billable_impressions'] = uniquePackages.sum(p => p.metrics.billable_impressions * p.data.operative_net_unit_cost / 1000)
            data['delivered_spend_first_party_impressions'] = uniquePackages.sum(p => p.metrics.first_party_impressions * p.data.operative_net_unit_cost / 1000)
            data['delivered_spend_rbp_billable_imps'] = uniquePackages.sum(p => (p.data.fw_enable_dar_new_calculation === 'true' ? Number(p.metrics.rbp_billable_imps) || 0 : Number(p.metrics.billable_impressions) || 0) * p.data.operative_net_unit_cost / 1000)
            metrics['billable_impressions'] = uniquePackages.sum(p => Number(p.metrics.billable_impressions) || 0)
            metrics['first_party_impressions'] = uniquePackages.sum(p => Number(p.metrics.first_party_impressions) || 0)
            metrics['rbp_billable_imps'] = uniquePackages.sum(p => p.data.fw_enable_dar_new_calculation === 'true' ? Number(p.metrics.rbp_billable_imps) || 0 : Number(p.metrics.billable_impressions) || 0);
            metrics['billableClicks'] = uniquePackages.sum(p => p.metrics.billable_clicks || 0)
            metrics['deliveredBillableRevenue'] = uniquePackages.sum(p => p.data.deliveredBillableRevenue || 0)
            metrics['bookedBillableRevenue'] = uniquePackages.sum(p => p.data.bookedBillableRevenue || 0)
            metrics['moat_universal_interactions'] = uniquePackages.sum(p => p.metrics.moat_universal_interactions || 0)
            metrics['moat_impressions_analyzed'] = uniquePackages.sum(p => p.metrics.moat_impressions_analyzed || 0)
            metrics['doubleverify_brand_safe_rate'] = uniquePackages.sum(p => p.metrics.doubleverify_brand_safe_rate || 0) / Object.keys(uniquePackages).length
            metrics['doubleverify_display_viewable_rate'] = uniquePackages.sum(p => p.metrics.doubleverify_display_viewable_rate || 0) / Object.keys(uniquePackages).length
            metrics['doubleverify_unique_incident_rate'] = uniquePackages.sum(p => p.metrics.doubleverify_unique_incident_rate || 0) / Object.keys(uniquePackages).length
            metrics['moat_total_exposure_time_sec'] = uniquePackages.sum(p => p.metrics.moat_total_exposure_time_sec || 0)
            metrics['doubleverify_fraudsivt_incidents'] = uniquePackages.sum(p => p.metrics.doubleverify_fraudsivt_incidents || 0)
            metrics['moat_impressions_analyzed_filtered_for_givt'] = uniquePackages.sum(p => p.metrics.moat_impressions_analyzed_filtered_for_givt || 0)
            metrics['dfp_video_start'] = uniquePackages.sum(p => Number(p.metrics.dfp_video_start) || 0)
            metrics['dfp_video_complete'] = uniquePackages.sum(p => Number(p.metrics.dfp_video_complete) || 0)
            metrics['freewheel_video_complete'] = uniquePackages.sum(p => Number(p.metrics.freewheel_video_complete) || 0)
            metrics['first_party_impressions'] = uniquePackages.sum(p => Number(p.metrics.first_party_impressions) || 0)

            metrics['total_ivt'] = metrics['doubleverify_fraudsivt_incidents'] + metrics['moat_impressions_analyzed_filtered_for_givt']

            metrics['universalInteractionRate'] = (metrics['moat_impressions_analyzed'] == 0) ? 0 : metrics['moat_universal_interactions'] / metrics['moat_impressions_analyzed']
            const billableImpsWithoutTVGlass = uniquePackages.sum(p =>
              p.metrics.billable_impressions -
              (p.metrics['dfp_vod_impressions'] || 0) -
              (p.metrics['dfp_ott_impressions'] || 0)
            )
            metrics['ctr'] = billableImpsWithoutTVGlass !== 0
              ? metrics['billableClicks'] / billableImpsWithoutTVGlass
              : 0
            metrics['vcr'] = (metrics['dfp_video_complete'] + metrics['freewheel_video_complete']) / metrics['first_party_impressions']
            metrics['moat_viewability_rate'] = uniquePackages.sum(p => Number(p.metrics.moat_viewability_rate) || 0) / Object.keys(uniquePackages).length
            return new Packages(packageName, metrics, data)
          })
        })
      )
  }

  packageCreatives() {
    return forkJoin([this.packages(), this.creatives()]).pipe(
      map(([packages, creatives]) => {
        return packages.map(p => {
          const packageName = p.name
          const packageCreatives = creatives.filter(c => c.lineItem.package_name === packageName)
          packageCreatives.forEach(pg => {
            pg.metrics['ctr'] = pg.metrics.billable_clicks / pg.metrics.billable_impressions
          })
          return new PackageCreatives(packageName, packageCreatives)
        })
      }),
    )
  }

  packagesByDay() {
    return this.dataService
      .load('billing_combiner_line_item_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const packageList = (result && result.series || []).map(serie => {
            const data = serie.getData('line_item')
            const metrics = this.toSeriesMetrics(serie.metrics)
            if (data.package_name == null) data['package_name'] = 'N/A'
            return new PackagesByDay(data['package_name'], metrics, data)
          })
          const groupedPackage = packageList
            .filter(item => {
              if (SkipItems.some(match => item.data.line_item.includes(match))) return false
              return item
            }).groupBy(p => p.name)
          return Object.entries(groupedPackage).map(([packageName, lineItems]: [string, any[]]) => {
            const metrics = {ctr1pt: [], ctr3pt: []}, data = {}
            const dfpImps = []
            const dfpClicks = []
            const billableImps = []
            const billableClicks = []
            lineItems.forEach(lineItem => {
              lineItem.metrics.dfp_impressions.forEach((imps, i) => {
                dfpImps[i] = (imps || 0) + (dfpImps[i] || 0)
              })
              lineItem.metrics.dfp_clicks.forEach((clicks, i) => {
                dfpClicks[i] = (clicks || 0) + (dfpClicks[i] || 0)
              })
              lineItem.metrics.billable_impressions.forEach((imps, i) => {
                billableImps[i] = (imps || 0) + (billableImps[i] || 0)
              })
              lineItem.metrics.billable_clicks.forEach((clicks, i) => {
                billableClicks[i] = (clicks || 0) + (billableClicks[i] || 0)
              })
            })
            dfpImps.forEach((dfpImp, i) => {
              if (dfpImp === 0) metrics['ctr1pt'][i] = 0
              else metrics['ctr1pt'][i] = dfpClicks[i] / dfpImp
            })
            billableImps.forEach((billableImp, i) => {
              if (billableImp === 0) metrics['ctr3pt'][i] = 0
              else metrics['ctr3pt'][i] = billableClicks[i] / billableImp
            })
            data['timestamps'] = result.timestamps
            return new PackagesByDay(packageName, metrics, data)
          })
        })
      )
  }

  series() {
    return this.dataService
      .load('billing_combiner_campaign_per_day')
      .pipe(catchError(() => of(null)))
      .pipe(
        map((result) => {
          const ctr = new Metric('ctr', {});
          const ctr1pt = new Metric('ctr1pt', {});
          (result && result.series || [])
            .forEach(serie => {
              const arrBillableClicks = serie.metrics.find(item => item.name === 'billable_clicks')
              const arrbillableImpressions = serie.metrics.find(item => item.name === 'billable_impressions')
              const resultCtr = [], result1ptCtr = []
              const arr1ptClicks = serie.metrics.find(item => item.name === 'dfp_clicks')
              const arr1ptImpressions = serie.metrics.find(item => item.name === 'dfp_impressions')
              if (!arrBillableClicks || !arrBillableClicks.values) {
                return []
              }
              arrBillableClicks.values.forEach((value, i) => {
                resultCtr.push(value / arrbillableImpressions.values[i])
              })
              arr1ptClicks.values.forEach((value, i) => {
                result1ptCtr.push(value / arr1ptImpressions.values[i])
              })
              if(!serie.metrics.find(item => item.name === 'ctr')) {
                serie.metrics.push(new MetricValues(ctr, resultCtr))
              }
              if(!serie.metrics.find(item => item.name === 'ctr1pt')) {
                serie.metrics.push(new MetricValues(ctr1pt, result1ptCtr))
              }
              return result.series
            })
            return result.getChartSeries(['ctr', 'ctr1pt'])
        })
      )
  }

  packagesSeries() {
    return this.packagesByDay().pipe(
      map(result => {
        result.map(serie => {
          serie['serie'] = []
          Object.keys(serie.metrics).map(function(key: any, index) {
            const data = serie.data.timestamps.map((t, i) => [t, serie.metrics[key][i]])
            const series =  {
              name: key,
              data: data,
              format: "number"
            }
            serie['serie'].push(series)
          })
        })
        return result
      })
    )
  }

  creatives() {
    return this.dataService
      .load('billing_combiner_creative')
      .pipe(catchError(() => of(null)))
      .pipe(
        map(result => {
          const creatives = (result && result.rows || []).map(row => {
            const metrics = this.metricsToHash(row.metrics)
            metrics['ctr'] = metrics['billable_impressions'] !== 0
              ? metrics['billable_clicks'] / metrics['billable_impressions']
              : 0
            const creative = row.getData('creative')
            const lineItem = row.getData('line_item')
            metrics['rbp_billable_imps'] = lineItem.fw_enable_dar_new_calculation === 'true' ? Number(metrics.rbp_billable_imps) || 0 : Number(metrics.billable_impressions) || 0;
            return new Creative(metrics, creative, lineItem)
          })
          return creatives.filter(item => {
            if (SkipItems.some(match => item.creative.creative && item.creative.creative.includes(match)) ||
              SkipItems.some(match => item.lineItem.line_item && item.lineItem.line_item.includes(match))) {
              return false
            }
            return item
          })
        })
      )
  }

  protected metricsToHash(metrics) {
    return metrics.reduce((memo, metric) => {
      memo[metric.name] = metric.value
      return memo
    }, {})
  }

  protected toSeriesMetrics(rawMetrics: { name: string; values: string[] | number[] }[]) {
    const obj = {}
    for (const metric of rawMetrics) {
      obj[metric.name] = metric.values
    }
    return obj
  }

  protected displaysToHash(metrics) {
    return metrics.reduce((memo, metric) => {
      memo[metric.dimension.name] = metric.value
      return memo
    }, {})
  }
}

const US_STATES_DEFINITIONS = {
  'alabama': 'us-al',
  'alaska': 'us-ak',
  'arizona': 'us-az',
  'arkansas': 'us-ar',
  'california': 'us-ca',
  'colorado': 'us-co',
  'connecticut': 'us-ct',
  'delaware': 'us-de',
  'dist of columbia': 'us-dc',
  'florida': 'us-fl',
  'georgia': 'us-ga',
  'hawaii': 'us-hi',
  'idaho': 'us-id',
  'illinois': 'us-il',
  'indiana': 'us-in',
  'iowa': 'us-ia',
  'kansas': 'us-ks',
  'kentucky': 'us-ky',
  'louisiana': 'us-la',
  'maine': 'us-me',
  'maryland': 'us-md',
  'massachusetts': 'us-ma',
  'michigan': 'us-mi',
  'minnesota': 'us-mn',
  'mississippi': 'us-ms',
  'missouri': 'us-mo',
  'montana': 'us-mt',
  'nebraska': 'us-ne',
  'nevada': 'us-nv',
  'new hampshire': 'us-nh',
  'new jersey': 'us-nj',
  'new mexico': 'us-nm',
  'new york': 'us-ny',
  'north carolina': 'us-nc',
  'north dakota': 'us-nd',
  'ohio': 'us-oh',
  'oklahoma': 'us-ok',
  'oregon': 'us-or',
  'pennsylvania': 'us-pa',
  'rhode island': 'us-ri',
  'south carolina': 'us-sc',
  'south dakota': 'us-sd',
  'tennessee': 'us-tn',
  'texas': 'us-tx',
  'utah': 'us-ut',
  'vermont': 'us-vt',
  'virginia': 'us-va',
  'washington': 'us-wa',
  'west virginia': 'us-wv',
  'wisconsin': 'us-wi',
  'wyoming': 'us-wy',
  'alabama, us': 'us-al',
  'alaska, us': 'us-ak',
  'arizona, us': 'us-az',
  'arkansas, us': 'us-ar',
  'california, us': 'us-ca',
  'colorado, us': 'us-co',
  'connecticut, us': 'us-ct',
  'delaware, us': 'us-de',
  'florida, us': 'us-fl',
  'georgia, us': 'us-ga',
  'hawaii, us': 'us-hi',
  'idaho, us': 'us-id',
  'illinois, us': 'us-il',
  'indiana, us': 'us-in',
  'iowa, us': 'us-ia',
  'kansas, us': 'us-ks',
  'kentucky, us': 'us-ky',
  'louisiana, us': 'us-la',
  'maine, us': 'us-me',
  'maryland, us': 'us-md',
  'michigan, us': 'us-mi',
  'minnesota, us': 'us-mn',
  'mississippi, us': 'us-ms',
  'missouri, us': 'us-mo',
  'montana, us': 'us-mt',
  'nebraska, us': 'us-ne',
  'nevada, us': 'us-nv',
  'new hampshire, us': 'us-nh',
  'new jersey, us': 'us-nj',
  'new mexico, us': 'us-nm',
  'new york, us': 'us-ny',
  'north carolina, us': 'us-nc',
  'north dakota, us': 'us-nd',
  'ohio, us': 'us-oh',
  'oklahoma, us': 'us-ok',
  'oregon, us': 'us-or',
  'pennsylvania, us': 'us-pa',
  'rhode island, us': 'us-ri',
  'south carolina, us': 'us-sc',
  'south dakota, us': 'us-sd',
  'tennessee, us': 'us-tn',
  'texas, us': 'us-tx',
  'utah, us': 'us-ut',
  'vermont, us': 'us-vt',
  'virginia, us': 'us-va',
  'washington, us': 'us-wa',
  'west virginia, us': 'us-wv',
  'wisconsin, us': 'us-wi',
  'wyoming, us': 'us-wy'
}
