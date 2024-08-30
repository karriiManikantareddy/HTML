import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {TraderVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {HeaderComponent} from './components/header/header.component'
import {CampaignDataService} from './services/campaign-data.service'
import {TraderDataService} from './services/trader-data.service'

import {CreativeTopComponent} from './slides/05-top-creatives/creative-top/creative-top.component'

import {CoverSlide} from './slides/01-cover/cover.slide'
import {TableOfContentsSlide} from './slides/02-table-of-contents/table-of-contents.slide'
import {Summary} from './slides/02.5-summary/summary.slide'
import {OverviewSlide} from './slides/03-overview/overview.slide'
import {LineItemsSlide} from './slides/04-line-items/line-items.slide'
import {TopCreativesSlide} from './slides/05-top-creatives/top-creatives.slide'
import {PlatformsSlide} from './slides/07-platforms/platforms.slide'
import {GeographicalDistributionSlide} from './slides/08-geographical-distribution/geographical-distribution.slide'
import {ThankYouSlide} from './slides/98-thank-you/thank-you.slide'
import {GlossarySlide} from './slides/99-glossary/glossary.slide'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    CreativeTopComponent,

    CoverSlide,
    TableOfContentsSlide,
    Summary,
    OverviewSlide,
    GlossarySlide,
    LineItemsSlide,
    PlatformsSlide,
    GeographicalDistributionSlide,
    TopCreativesSlide,
    ThankYouSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: TraderDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: TraderVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
