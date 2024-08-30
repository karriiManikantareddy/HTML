import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {MlbVariables} from 'projects/mlb-campaign/src/app/variables'
import {MlbDataService} from 'projects/mlb-campaign/src/app/services/mlb-data.service'
import {AdvertiserDataService} from './services/advertiser-data.service'

import {DividerComponent} from 'projects/mlb-campaign/src/app/components/divider/divider.component'
import {CoverSlide} from 'projects/mlb-campaign/src/app/slides/cover/cover.slide'
import {OverviewSlide} from 'projects/mlb-campaign/src/app/slides/overview/overview.slide'
import {PowerRankingsCoverSlide} from 'projects/mlb-campaign/src/app/slides/power-rankings-cover/power-rankings-cover.slide'
import {PowerRankingsVideoSlide} from 'projects/mlb-campaign/src/app/slides/power-rankings-video/power-rankings-video.slide'
import {MlbTvCoverSlide} from 'projects/mlb-campaign/src/app/slides/mlb-tv-cover/mlb-tv-cover.slide'
import {MlbTvOverviewSlide} from 'projects/mlb-campaign/src/app/slides/mlb-tv-overview/mlb-tv-overview.slide'
import {ThankYouSlide} from 'projects/mlb-campaign/src/app/slides/thank-you/thank-you.slide'

@NgModule({
  declarations: [
    AppComponent,
    DividerComponent,
    CoverSlide,
    OverviewSlide,
    PowerRankingsCoverSlide,
    PowerRankingsVideoSlide,
    MlbTvCoverSlide,
    MlbTvOverviewSlide,
    ThankYouSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: MlbDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: MlbVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
