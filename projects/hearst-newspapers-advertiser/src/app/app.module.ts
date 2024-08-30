import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {HearstNewspapersVariables} from './variables'
import {HearstNewspapersDataService} from './services/hearst-newspapers-data.service'
import {HearstNewspapersSettingsService} from './services/hearst-newspapers-settings.service'
import {AdvertiserDataService} from './services/advertiser-data.service'

import {DividerComponent} from './components/divider/divider.component'
import {SidebarComponent} from './components/sidebar/sidebar.component'
import {CoverSlide} from './slides/cover/cover.slide'
import {SocialCover} from './slides/social-cover/social-cover.slide'
import {SocialOverviewSlide} from './slides/social-overview/social-overview.slide'
import {SocialCampaignsSlide} from './slides/social-campaigns/social-campaigns.slide'
import {SocialAdsSlide} from './slides/social-ads/social-ads.slide'
import {SocialPlatformsSlide} from './slides/social-platforms/social-platforms.slide'
import {SemCover} from './slides/sem-cover/sem-cover.slide'
import {SemOverviewSlide} from './slides/sem-overview/sem-overview.slide'
import {SemCampaignsSlide} from './slides/sem-campaigns/sem-campaigns.slide'
import {DisplayCover} from './slides/display-cover/display-cover.slide'
import {DisplayOverviewSlide} from './slides/display-overview/display-overview.slide'
import {DisplayAdsSlide} from './slides/display-ads/display-ads.slide'
import {DisplayPlatformsSlide} from './slides/display-platforms/display-platforms.slide'
import {EmailCover} from './slides/email-cover/email-cover.slide'
import {EmailOverviewSlide} from './slides/email-overview/email-overview.slide'
import {EmailAdsSlide} from './slides/email-ads/email-ads.slide'
import {EmailLinksSlide} from './slides/email-links/email-links.slide'
import {EmailScreenshotsSlide} from './slides/email-screenshots/email-screenshots.slide'
import {NewsletterCoverSlide} from './slides/newsletter-cover/newsletter-cover.slide'
import {NewsletterOverviewSlide} from './slides/newsletter-overview/newsletter-overview.slide'
import {SeoCoverSlide} from './slides/seo-cover/seo-cover.slide'
import {SeoOverviewSlide} from './slides/seo-overview/seo-overview.slide'
import {LocalEdgeWebCoverSlide} from './slides/localedge-web-cover/localedge-web-cover.slide'
import {LocalEdgeWebOverviewSlide} from './slides/localedge-web-overview/localedge-web-overview.slide'
import {ThankYouSlide} from './slides/thank-you/thank-you.slide'

import {LocaleNumberPipe} from './pipes/locale-number.pipe'

@NgModule({
  declarations: [
    AppComponent,
    DividerComponent,
    SidebarComponent,
    CoverSlide,
    SocialCover,
    SocialOverviewSlide,
    SocialCampaignsSlide,
    SocialAdsSlide,
    SocialPlatformsSlide,
    SemCover,
    SemOverviewSlide,
    SemCampaignsSlide,
    DisplayCover,
    DisplayOverviewSlide,
    DisplayAdsSlide,
    DisplayPlatformsSlide,
    EmailCover,
    EmailOverviewSlide,
    EmailAdsSlide,
    EmailLinksSlide,
    EmailScreenshotsSlide,
    NewsletterCoverSlide,
    NewsletterOverviewSlide,
    SeoCoverSlide,
    SeoOverviewSlide,
    LocalEdgeWebCoverSlide,
    LocalEdgeWebOverviewSlide,
    ThankYouSlide,
    LocaleNumberPipe,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: HearstNewspapersDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: HearstNewspapersVariables},
    HearstNewspapersSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
