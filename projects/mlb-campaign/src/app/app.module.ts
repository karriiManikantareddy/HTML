import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {MlbVariables} from './variables'
import {MlbDataService} from './services/mlb-data.service'
import {CampaignDataService} from './services/campaign-data.service'

import {DividerComponent} from './components/divider/divider.component'
import {CoverSlide} from './slides/cover/cover.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {PowerRankingsCoverSlide} from './slides/power-rankings-cover/power-rankings-cover.slide'
import {PowerRankingsVideoSlide} from './slides/power-rankings-video/power-rankings-video.slide'
import {MlbTvCoverSlide} from './slides/mlb-tv-cover/mlb-tv-cover.slide'
import {MlbTvOverviewSlide} from './slides/mlb-tv-overview/mlb-tv-overview.slide'
import {ThankYouSlide} from './slides/thank-you/thank-you.slide'

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
    {provide: MlbDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: MlbVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
