import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {TraderVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {CampaignDataService} from './services/campaign-data.service'
import {StandardDataService} from './services/standard-data.service'

import {CoverSlide} from './slides/cover/cover.slide'
import {AgendaSlide} from './slides/agenda/agenda.slide'
import {ReportingSummarySlide} from './slides/reporting-summary/reporting-summary.slide'
import {TopCreativesSlide} from './slides/top-creatives/top-creatives.slide'
import {OverallCampaignPerformanceSlide} from './slides/overall-campaign-performance/overall-campaign-performance.slide'
import {PerformanceByPlatformSlide} from './slides/performance-by-platform/performance-by-platform.slide'
import {MediaPerformanceSlide} from './slides/media-performance/media-performance.slide'
import {DataDefinitionsSlide} from './slides/data-definitions/data-definitions.slide'
import {SocialPerformanceSlide} from './slides/social-performance/social-performance.slide'
import {VideoPerformanceSlide} from './slides/video-performance/video-performance.slide';
import {ThankYouSlide} from './slides/thank-you/thank-you.slide'
import {CreativeTopComponent} from './slides/top-creatives/creative-top/creative-top.component'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,

    CoverSlide,
    AgendaSlide,
    ReportingSummarySlide,
    OverallCampaignPerformanceSlide,
    SocialPerformanceSlide,
    VideoPerformanceSlide,
    MediaPerformanceSlide,
    TopCreativesSlide,
    CreativeTopComponent,
    PerformanceByPlatformSlide,
    DataDefinitionsSlide,
    ThankYouSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: StandardDataService, useClass: CampaignDataService},
    {provide: TraderVariables, useClass: TraderVariables},
  ],
  bootstrap: [AppComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class AppModule {
}
