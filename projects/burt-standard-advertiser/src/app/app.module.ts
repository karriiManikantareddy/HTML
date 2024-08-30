import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {BurtVariables} from 'projects/burt-standard-campaign/src/app//variables'
import {FooterComponent} from 'projects/burt-standard-campaign/src/app/components/footer/footer.component'
import {HeaderLogoComponent} from 'projects/burt-standard-campaign/src/app/components/header-logo/header-logo.component'
import {AdvertiserDataService} from './services/advertiser-data.service'
import {StandardDataService} from 'projects/burt-standard-campaign/src/app//services/standard-data.service'

import {CreativeLeftComponent} from 'projects/burt-standard-campaign/src/app/slides/05-top-creatives/creative-left/creative-left.component'
import {CreativeTopComponent} from 'projects/burt-standard-campaign/src/app/slides/05-top-creatives/creative-top/creative-top.component'
import {CentroCreativeTopComponent} from 'projects/burt-standard-campaign/src/app/slides/051-centro-top-creatives/centro-creative-top/centro-creative-top.component'

import {CoverSlide} from 'projects/burt-standard-campaign/src/app/slides/01-cover/cover.slide'
import {TableOfContentsSlide} from 'projects/burt-standard-campaign/src/app/slides/02-table-of-contents/table-of-contents.slide'
import {OverviewSlide} from 'projects/burt-standard-campaign/src/app/slides/03-overview/overview.slide'
import {CentroOverviewSlide} from 'projects/burt-standard-campaign/src/app/slides/031-centro-overview/centro-overview.slide'
import {LineItemsSlide} from 'projects/burt-standard-campaign/src/app/slides/04-line-items/line-items.slide'
import {CentroLineItemsSlide} from 'projects/burt-standard-campaign/src/app/slides/041-centro-line-items/centro-line-items.slide'
import {TopCreativesSlide} from 'projects/burt-standard-campaign/src/app/slides/05-top-creatives/top-creatives.slide'
import {CentroTopCreativesSlide} from 'projects/burt-standard-campaign/src/app/slides/051-centro-top-creatives/centro-top-creatives.slide'
import {CreativeSizesSlide} from 'projects/burt-standard-campaign/src/app/slides/06-creative-sizes/creative-sizes.slide'
import {PlatformsSlide} from 'projects/burt-standard-campaign/src/app/slides/07-platforms/platforms.slide'
import {CentroPlatformsSlide} from 'projects/burt-standard-campaign/src/app/slides/071-centro-platforms/centro-platforms.slide'
import {GeographicalDistributionSlide} from 'projects/burt-standard-campaign/src/app/slides/08-geographical-distribution/geographical-distribution.slide'
import {CentroGeographicalDistributionSlide} from 'projects/burt-standard-campaign/src/app/slides/081-centro-geographical-distribution/centro-geographical-distribution.slide'

import {ThankYouSlide} from 'projects/burt-standard-campaign/src/app/slides/98-thank-you/thank-you.slide'
import {GlossarySlide} from 'projects/burt-standard-campaign/src/app/slides/99-glossary/glossary.slide'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderLogoComponent,
    CreativeLeftComponent,
    CreativeTopComponent,

    CoverSlide,
    TableOfContentsSlide,
    OverviewSlide,
    GlossarySlide,
    LineItemsSlide,
    CreativeSizesSlide,
    PlatformsSlide,
    GeographicalDistributionSlide,
    TopCreativesSlide,
    ThankYouSlide,
    CentroOverviewSlide,
    CentroLineItemsSlide,
    CentroTopCreativesSlide,
    CentroPlatformsSlide,
    CentroGeographicalDistributionSlide,
    CentroCreativeTopComponent,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: StandardDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: BurtVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
