import {combineLatest, Subject, of, Observable} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {Injectable, Inject} from '@angular/core'
import {DataService} from 'projects/template-module/src/public_api'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import {CmgDataService, Metadata, Overview} from './cmg-data.service'
import { MetricValue } from 'projects/template-module/src/lib/services/result.model'
export * from './cmg-data.service'

@Injectable()
export class AdvertiserDataService extends CmgDataService {
  constructor(
    @Inject(WINDOW) window,
    protected dataService: DataService,
    ) {
    super(window)
  }

  metadata(): Observable<Metadata> {
    const subject = new Subject<Metadata>()
    combineLatest([
      this.amazonDisplayOverview(),
      this.amazonOttOverview(),
      this.googleAdsOverview(),
      this.bingOverview(),
      this.facebookAdsOverview(),
      this.birdeyeOverview(),
      this.elToroOverview(),
      this.gamutOverview(),
      this.marchexOverview(),
      this.yextOverview(),
      this.speedshiftOverview(),
      this.brightedgeOverview(),
      this.siteImpactOverview(),
      this.dv360VideoOverview(),
      this.dv360DisplayOverview(),
      this.googleAdManagerVideoOverview(),
      this.googleAdManagerDisplayOverview(),
      this.audienceExtensionAudio(),
      this.ooAudioStreaming(),
      this.doohVistarOverview(),
      this.prerollOverview(),
      this.semrushDomainOverview(),
    ]).subscribe((overviews) => {
      const overview = overviews.compact()[0]
      subject.next(new Metadata(overview.advertiserName, this.dates))
    })
    return subject
  }

  amazonDisplayOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('amazon_dsp_display_overview').pipe(catchError(() => of(null))),
      this.dataService.load('amazon_dsp_display_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_amazon_dsp_display', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  amazonOttOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('amazon_dsp_ott_overview').pipe(catchError(() => of(null))),
      this.dataService.load('amazon_dsp_ott_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_amazon_dsp_ott', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  googleAdsOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('google_ads_overview').pipe(catchError(() => of(null))),
      this.dataService.load('google_ads_overview_conversions').pipe(catchError(() => of(null))),
      this.dataService.load('google_ads_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, conversions, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const metrics = row.metrics;

        if (conversions.rows.length > 0) {
          const conversionsMetricsExists = metrics.some(metric => metric.name === conversions.rows[0].metrics[0].name);
          if (!conversionsMetricsExists) {
            metrics.push(conversions.rows[0].metrics[0]);
          }
        }

        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_google_ads', name, metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  bingOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('bing_overview').pipe(catchError(() => of(null))),
      this.dataService.load('bing_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_bing', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  facebookAdsOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('facebook_ads_overview').pipe(catchError(() => of(null))),
      this.dataService.load('facebook_ads_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_facebook_ads', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  groundtruthOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('groundtruth_overview').pipe(catchError(() => of(null))),
      this.dataService.load('groundtruth_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_groundtruth', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  birdeyeOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('birdeye_overview').pipe(catchError(() => of(null))),
      this.dataService.load('birdeye_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_birdeye', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  elToroOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('el_toro_overview').pipe(catchError(() => of(null))),
      this.dataService.load('el_toro_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_el_toro', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  gamutOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('gamut_overview').pipe(catchError(() => of(null))),
      this.dataService.load('gamut_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_gamut', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  marchexOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('marchex_overview').pipe(catchError(() => of(null))),
      this.dataService.load('marchex_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_marchex_combined', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  yextOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('yext_overview').pipe(catchError(() => of(null))),
      this.dataService.load('yext_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_yext', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  speedshiftOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('speedshift_overview').pipe(catchError(() => of(null))),
      this.dataService.load('speedshift_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_speedshift', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  brightedgeOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('brightedge_overview').pipe(catchError(() => of(null))),
      this.dataService.load('brightedge_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_brightedge', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  siteImpactOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('site_impact_overview').pipe(catchError(() => of(null))),
      this.dataService.load('site_impact_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_site_impact', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  dv360VideoOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('dv360_video_overview').pipe(catchError(() => of(null))),
      this.dataService.load('dv360_video_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_dv360_video', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  dv360DisplayOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('dv360_display_overview').pipe(catchError(() => of(null))),
      this.dataService.load('dv360_display_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_dv360_display', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  googleAdManagerVideoOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('google_ad_manager_video_overview').pipe(catchError(() => of(null))),
      this.dataService.load('google_ad_manager_video_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_google_ad_manager_video', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  googleAdManagerDisplayOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('google_ad_manager_display_overview').pipe(catchError(() => of(null))),
      this.dataService.load('google_ad_manager_display_overview_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_google_ad_manager_display', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  public doohVistarOverview(): Observable<Overview> {
    const subject = new Subject<Overview>();
    combineLatest([
      this.dataService.load('dooh_vistar').pipe(catchError(() => of(null))),
      this.dataService.load('dooh_vistar_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0];
      if (row) {
        const name = total.datasetName;
        const advertiserData = row.getData('mapping_advertiser');
        const metricNames = row.metrics.map(metric => metric.name);
        const overview = new Overview(advertiserData['mapping_advertiser'], 'dm_mapped_seed_vistar', name, row.metrics, series.getChartSeries(metricNames));
        subject.next(overview);
      } else {
        subject.next(null);
      }
    });
    return subject;
  }

  audienceExtensionAudio(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('audience_extension_audio').pipe(catchError(() => of(null))),
      this.dataService.load('audience_extension_audio_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(
          advertiserData['mapping_advertiser'],
          'mapped_seed_dv360_audio',
          name,
          row.metrics,
          series.getChartSeries(metricNames),
        )
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  ooAudioStreaming(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('oo_audio_streaming').pipe(catchError(() => of(null))),
      this.dataService.load('oo_audio_streaming_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(
          advertiserData['mapping_advertiser'],
          'dm_mapped_cfr_adswizz',
          name,
          row.metrics,
          series.getChartSeries(metricNames),
        )
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  prerollOverview(): Observable<Overview> {
    const subject = new Subject<Overview>()
    combineLatest([
      this.dataService.load('google_ad_manager_preroll').pipe(catchError(() => of(null))),
      this.dataService.load('google_ad_manager_preroll_daily').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || [])[0]
      if (row) {
        const name = total.datasetName
        const advertiserData = row.getData('mapping_advertiser')
        const metricNames = row.metrics.map(metric => metric.name)
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_google_ad_manager_preroll', name, row.metrics, series.getChartSeries(metricNames))
        subject.next(overview)
      } else {
        subject.next(null)
      }
    })
    return subject
  }

  semrushDomainOverview(): Observable<Overview> {
    const subject = new Subject<Overview>();
    combineLatest([
      this.dataService.load('semrush_domain_overview').pipe(catchError(() => of(null))),
      this.dataService.load('semrush_domain_overview_weekly').pipe(catchError(() => of(null))),
    ]).subscribe(([total, series]) => {
      const row = (total && total.rows || []).filter(row => row.metrics.every(metric => metric.value)).pop();
      if (row) {
        const name = total.datasetName;
        const advertiserData = row.getData('mapping_advertiser');
        const metricNames = row.metrics.map(metric => metric.name);
        const overview = new Overview(advertiserData['mapping_advertiser'], 'mapped_seed_semrush', name, row.metrics, series.getChartSeries(metricNames));
        subject.next(overview);
      } else {
        subject.next(null);
      }
    });
    return subject;
  }

}
