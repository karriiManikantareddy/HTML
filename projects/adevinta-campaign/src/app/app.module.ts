import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {AdevintaVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {CampaignDataService} from './services/campaign-data.service'
import {AdevintaDataService} from './services/adevinta-data.service'

import {CoverSlide} from './slides/01-cover/cover.slide'
import {TableOfContentsSlide} from './slides/02-table-of-contents/table-of-contents.slide'
import {ExecutiveSummarySlide} from './slides/03-executive-summary/executive-summary.slide'
import {OverviewClicksSlide} from './slides/04-overview-clicks/overview-clicks.slide'
import {OverviewViewabilitySlide} from './slides/05-overview-viewability/overview-viewability.slide'
import {LineItemPerformanceSlide} from './slides/06-line-item-performance/line-item-performance.slide'
import {CreativePerformanceSlide} from './slides/07-creative-performance/creative-performance.slide'
import {TopCreativesByCTRSlide} from './slides/08-top-creatives-by-ctr/top-creatives-by-ctr.slide'
import {TopCreativesByViewabilitySlide} from './slides/09-top-creatives-by-viewability/top-creatives-by-viewability.slide'
import {BottomCreativesByCTRSlide} from './slides/10-bottom-creatives-by-ctr/bottom-creatives-by-ctr.slide'
import {BottomCreativesByViewabilitySlide} from './slides/11-bottom-creatives-by-viewability/bottom-creatives-by-viewability.slide'
import {CreativeSizePerformanceSlide} from './slides/12-creative-size-performance/creative-size-performance.slide'
import {PositionPerformanceSlide} from './slides/13-position-performance/position-performance.slide'
import {TopCategoriesSlide} from './slides/14-top-categories/top-categories.slide'
import {PlatformsSlide} from './slides/15-platforms/platforms.slide'
import {GeographicalDistributionEuropeSlide} from './slides/16-geographical-distribution-europe/geographical-distribution-europe.slide'
import {
  GeographicalDistributionNetherlandsSlide,
} from './slides/17-geographical-distribution-netherlands/geographical-distribution-netherlands.slide'
import {GeographicalDistributionBelgiumSlide} from './slides/18-geographical-distribution-belgium/geographical-distribution-belgium.slide'
import {ThankYouSlide} from './slides/98-thank-you/thank-you.slide'
import { GlossarySlide } from './slides/99-glossary/glossary.slide'
import { CreativeAppendixSlide } from './slides/97-creative-appendix/creative-appendix.slide'
import { AdevintaSettingsService } from './services/adevinta-settings.service'


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,

    CoverSlide,
    TableOfContentsSlide,
    ExecutiveSummarySlide,
    OverviewClicksSlide,
    OverviewViewabilitySlide,
    LineItemPerformanceSlide,
    CreativePerformanceSlide,
    TopCreativesByCTRSlide,
    TopCreativesByViewabilitySlide,
    BottomCreativesByCTRSlide,
    BottomCreativesByViewabilitySlide,
    CreativeSizePerformanceSlide,
    GeographicalDistributionEuropeSlide,
    GeographicalDistributionNetherlandsSlide,
    GeographicalDistributionBelgiumSlide,
    GlossarySlide,
    PositionPerformanceSlide,
    TopCategoriesSlide,
    PlatformsSlide,
    ThankYouSlide,
    CreativeAppendixSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: AdevintaDataService, useClass: CampaignDataService},
    { provide: Variables, useClass: AdevintaVariables },
    AdevintaSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
