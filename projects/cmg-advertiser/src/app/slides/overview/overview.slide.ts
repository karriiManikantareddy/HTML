import {combineLatest} from 'rxjs'
import {Component, OnInit} from '@angular/core'
import {Variables} from 'projects/template-module/src/lib/variables'
import {CmgDataService, Overview} from '../../services/cmg-data.service'

@Component({
  selector: 'overview',
  templateUrl: './overview.slide.html',
  styleUrls: ['./overview.slide.less']
})
export class OverviewSlide implements OnInit {
  loading = true
  overviews: Overview[]
  legendItems: any[] = []
  metricIconConfig: any = {
    impressions: 'eye',
    click_throughs: 'click',
    ctr: 'percent',
  }

  constructor(
    private dataService: CmgDataService,
    private variables: Variables,
  ) {}

  ngOnInit() {
    combineLatest([
      this.dataService.amazonDisplayOverview(),
      this.dataService.amazonOttOverview(),
      this.dataService.googleAdsOverview(),
      this.dataService.bingOverview(),
      this.dataService.facebookAdsOverview(),
      this.dataService.birdeyeOverview(),
      this.dataService.elToroOverview(),
      this.dataService.gamutOverview(),
      this.dataService.marchexOverview(),
      this.dataService.yextOverview(),
      this.dataService.speedshiftOverview(),
      this.dataService.brightedgeOverview(),
      this.dataService.siteImpactOverview(),
      this.dataService.prerollOverview(),
      this.dataService.dv360VideoOverview(),
      this.dataService.dv360DisplayOverview(),
      this.dataService.googleAdManagerVideoOverview(),
      this.dataService.googleAdManagerDisplayOverview(),
      this.dataService.doohVistarOverview(),
      this.dataService.audienceExtensionAudio(),
      this.dataService.ooAudioStreaming(),
      this.dataService.semrushDomainOverview(),
    ])
    .subscribe((overviews) => {
      this.loading = false
      this.overviews = overviews.compact()
    })
  }
}
