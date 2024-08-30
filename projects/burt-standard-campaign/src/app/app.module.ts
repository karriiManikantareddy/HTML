import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {BurtVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {HeaderLogoComponent} from './components/header-logo/header-logo.component'
import {CampaignDataService} from './services/campaign-data.service'
import {StandardDataService} from './services/standard-data.service'
import {TemplateConfigService} from './services/template-config.service'

import {CreativeLeftComponent} from './slides/05-top-creatives/creative-left/creative-left.component'
import {CreativeTopComponent} from './slides/05-top-creatives/creative-top/creative-top.component'
import {CentroCreativeTopComponent} from './slides/051-centro-top-creatives/centro-creative-top/centro-creative-top.component'

import {CoverSlide} from './slides/01-cover/cover.slide'
import {TableOfContentsSlide} from './slides/02-table-of-contents/table-of-contents.slide'
import {OverviewSlide} from './slides/03-overview/overview.slide'
import {CentroOverviewSlide} from './slides/031-centro-overview/centro-overview.slide'
import {LineItemsSlide} from './slides/04-line-items/line-items.slide'
import {CentroLineItemsSlide} from './slides/041-centro-line-items/centro-line-items.slide'
import {TopCreativesSlide} from './slides/05-top-creatives/top-creatives.slide'
import {CentroTopCreativesSlide} from './slides/051-centro-top-creatives/centro-top-creatives.slide'
import {CreativeSizesSlide} from './slides/06-creative-sizes/creative-sizes.slide'
import {PlatformsSlide} from './slides/07-platforms/platforms.slide'
import {CentroPlatformsSlide} from './slides/071-centro-platforms/centro-platforms.slide'
import {GeographicalDistributionSlide} from './slides/08-geographical-distribution/geographical-distribution.slide'
import {CentroGeographicalDistributionSlide} from './slides/081-centro-geographical-distribution/centro-geographical-distribution.slide'

import {ThankYouSlide} from './slides/98-thank-you/thank-you.slide'
import {GlossarySlide} from './slides/99-glossary/glossary.slide'

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
    CentroCreativeTopComponent,
    CentroPlatformsSlide,
    CentroGeographicalDistributionSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: StandardDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: BurtVariables},
    TemplateConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
