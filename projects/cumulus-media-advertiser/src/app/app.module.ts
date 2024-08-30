import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {HearstNewspapersVariables} from './variables'
import {CumulusMediaDataService} from './services/cumulus-media-data.service'
import {AdvertiserDataService} from './services/advertiser-data.service'

import {DividerComponent} from './components/divider/divider.component'
import {SidebarComponent} from './components/sidebar/sidebar.component'
import {CoverSlide} from './slides/cover/cover.slide'
import {PaidSocialCover} from './slides/paid-social-cover/paid-social-cover.slide'
import {SocialOverviewSlide} from './slides/social-overview/social-overview.slide'
import {SocialCampaignsSlide} from './slides/social-campaigns/social-campaigns.slide'
import {SocialAdsSlide} from './slides/social-ads/social-ads.slide'
import {SocialPlatformsSlide} from './slides/social-platforms/social-platforms.slide'
import {WebsiteCover} from './slides/website-cover/website-cover.slide'
import {WebsiteOverviewSlide} from './slides/website-overview/website-overview.slide'
import {WebsiteDemoSlide} from './slides/website-demo/website-demo.slide'
import {GamCoverSlide} from './slides/gam-cover/gam-cover.slide'
import {GamOverviewSlide} from './slides/gam-overview/gam-overview.slide'
import {GamAdsSlide} from './slides/gam-ads/gam-ads.slide'
import {CentroCoverSlide} from './slides/centro-cover/centro-cover.slide'
import {CentroOverviewSlide} from './slides/centro-overview/centro-overview.slide'
import {CentroAdsSlide} from './slides/centro-ads/centro-ads.slide'

@NgModule({
  declarations: [
    AppComponent,
    DividerComponent,
    SidebarComponent,
    CoverSlide,
    PaidSocialCover,
    SocialOverviewSlide,
    SocialCampaignsSlide,
    SocialAdsSlide,
    SocialPlatformsSlide,
    WebsiteCover,
    WebsiteOverviewSlide,
    WebsiteDemoSlide,
    GamCoverSlide,
    GamOverviewSlide,
    GamAdsSlide,
    CentroCoverSlide,
    CentroOverviewSlide,
    CentroAdsSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: CumulusMediaDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: HearstNewspapersVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
