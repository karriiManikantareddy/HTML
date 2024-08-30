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
import {HearstMagazinesDataService} from './services/hearst-magazines-data.service'

import {CreativeTopComponent} from './slides/05-top-creatives/creative-top/creative-top.component'
import {CreativeSocialTopComponent} from './slides/051-top-social-creatives/creative-social-top/creative-social-top.component'

import {CoverSlide} from './slides/01-cover/cover.slide'
import {TableOfContentsSlide} from './slides/02-table-of-contents/table-of-contents.slide'
import {OverviewSlide} from './slides/03-overview/overview.slide'
import {LineItemsSlide} from './slides/04-line-items/line-items.slide'
import {TopCreativesSlide} from './slides/05-top-creatives/top-creatives.slide'
import {TopSocialCreativesSlide} from './slides/051-top-social-creatives/top-social-creatives.slide'
import {PlatformsSlide} from './slides/07-platforms/platforms.slide'
import {SocialPublisherPlatformsSlide} from './slides/071-social-publisher-platforms/social-publisher-platforms.slide'
import {BrandedContentOverview} from './slides/08-branded-content-overview/branded-content-overview.slide'

import {ThankYouSlide} from './slides/98-thank-you/thank-you.slide'
import {GlossarySlide} from './slides/99-glossary/glossary.slide'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderLogoComponent,
    CreativeTopComponent,
    CreativeSocialTopComponent,

    CoverSlide,
    TableOfContentsSlide,
    OverviewSlide,
    GlossarySlide,
    LineItemsSlide,
    PlatformsSlide,
    SocialPublisherPlatformsSlide,
    TopCreativesSlide,
    TopSocialCreativesSlide,
    BrandedContentOverview,
    ThankYouSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: HearstMagazinesDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: BurtVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
