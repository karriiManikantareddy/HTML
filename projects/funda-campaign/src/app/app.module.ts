import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'
import {TranslationModule} from 'projects/translation-module/src/public_api'

import {AppComponent} from './app.component'
import {FundaVariables} from './variables'

import {FooterComponent} from './components/footer/footer.component'
import {HeaderLineComponent} from './components/header-line/header-line.component'
import {FooterLineComponent} from './components/footer-line/footer-line.component'
import {CreativePreviewComponent} from './components/creative-preview/creative-preview.component'
import {CampaignDataService} from './services/campaign-data.service'
import {FundaDataService} from './services/funda-data.service'

import {CoverSlide} from './slides/cover/cover.slide'
import {TableOfContentsSlide} from './slides/table-of-contents/table-of-contents.slide'
import {AboutCampaignWholePageSlide} from './slides/about-campaign-whole-page/about-campaign-whole-page.slide'
import {AboutCampaignHalfPageSlide} from './slides/about-campaign-half-page/about-campaign-half-page.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {GeographicalDistributionSlide} from './slides/geographical-distribution/geographical-distribution.slide'
import {PlatformsSlide} from './slides/platforms/platforms.slide'
import {DomainsSlide} from './slides/domains/domains.slide'
import {NativeCreativesSlide} from './slides/native-creatives/native-creatives.slide'
import {LineItemsSlide} from './slides/line-items/line-items.slide'
import {TopCreativesSlide} from './slides/top-creatives/top-creatives.slide'
import {ArticlePerformanceSlide} from './slides/article-performance/article-performance.slide'
import {GlossarySlide} from './slides/glossary/glossary.slide'
import {SalesRepSlide} from './slides/sales-rep/sales-rep.slide'
import {FinalSlide} from './slides/final/final.slide';
import { OverzichtComponent } from './slides/overzicht/overzicht.component';
import { ResultatenComponent } from './slides/resultaten/resultaten.component';
import { ImpactComponent } from './slides/impact/impact.component';
import { LearningsComponent } from './slides/learnings/learnings.component';
import { OnderdeelComponent } from './slides/onderdeel/onderdeel.component';
import { CampagneComponent } from './slides/campagne/campagne.component';
import { CreativesComponent } from './slides/creatives/creatives.component';
import { AnalyseComponent } from './slides/analyse/analyse.component';
import { DevicePlatformComponent } from './slides/device-platform/device-platform.component'
import {PageComponent} from './slides/page/page.component'
import { HeaderComponent } from './slides/header/header.component'
import { FooterBoxComponent } from './slides/footer-box/footer-box.component'
import { CampaignHighlightsComponent } from './slides/campaign-highlights/campaign-highlights.component'




@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderLineComponent,
    FooterLineComponent,
    CreativePreviewComponent,
    HeaderComponent,
    FooterBoxComponent,

    CoverSlide,
    TableOfContentsSlide,
    AboutCampaignWholePageSlide,
    AboutCampaignHalfPageSlide,
    OverviewSlide,
    GeographicalDistributionSlide,
    PlatformsSlide,
    DomainsSlide,
    NativeCreativesSlide,
    LineItemsSlide,
    TopCreativesSlide,
    ArticlePerformanceSlide,
    GlossarySlide,
    SalesRepSlide,
    FinalSlide,
    OverzichtComponent,
    ResultatenComponent,
    ImpactComponent,
    LearningsComponent,
    OnderdeelComponent,
    CampagneComponent,
    CreativesComponent,
    AnalyseComponent,
    DevicePlatformComponent,
    PageComponent,
    CampaignHighlightsComponent,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule,
    TranslationModule
  ],
  providers: [
    {provide: FundaDataService, useClass: CampaignDataService},
    {provide: FundaVariables, useClass: FundaVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
