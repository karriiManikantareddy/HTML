import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {TheAdvocateVariables} from './variables'
import {TheAdvocateDataService} from './services/the-advocate-data.service'
import {AdvertiserDataService} from './services/advertiser-data.service'
import {DividerComponent} from './components/divider/divider.component'

import {SlideHeaderComponent} from './components/slide-header/slide-header.component'
import {SlideFooterComponent} from './components/slide-footer/slide-footer.component'
import {OverviewComponent} from './components/overview/overview.component'
import {GamCreativeComponent} from './components/gam-creative/gam-creative.component'
import {TheAdvocateTableComponent} from './components/the-advocate-table/the-advocate-table.component'
import {CoverSlide} from './slides/cover/cover.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {OnsiteDisplayOverviewSlide} from './slides/onsite-display-overview/onsite-display-overview.slide'
import {OnsiteDisplayBreakdownSlide} from './slides/onsite-display-breakdown/onsite-display-breakdown.slide'
import {OnsiteDisplayLineItemBreakdownSlide} from './slides/onsite-display-line-item-breakdown/onsite-display-line-item-breakdown.slide'
import {OnsiteDisplayMetroBreakdownSlide} from './slides/onsite-display-metro-breakdown/onsite-display-metro-breakdown.slide'
import {OnsiteVideoOverviewSlide} from './slides/onsite-video-overview/onsite-video-overview.slide'
import {OnsiteVideoBreakdownSlide} from './slides/onsite-video-breakdown/onsite-video-breakdown.slide'
import {OnsiteVideoMetroBreakdownSlide} from './slides/onsite-video-metro-breakdown/onsite-video-metro-breakdown.slide'
import {NewslettersOverviewSlide} from './slides/newsletters-overview/newsletters-overview.slide'
import {NewslettersBreakdownSlide} from './slides/newsletters-breakdown/newsletters-breakdown.slide'
import {NewslettersLineItemBreakdownSlide} from './slides/newsletters-line-item-breakdown/newsletters-line-item-breakdown.slide'
import {NewslettersMetroBreakdownSlide} from './slides/newsletters-metro-breakdown/newsletters-metro-breakdown.slide'
import {StreamingTvOverviewSlide} from './slides/streaming-tv-overview/streaming-tv-overview.slide'
import {StreamingTvBreakdownSlide} from './slides/streaming-tv-breakdown/streaming-tv-breakdown.slide'
import {StreamingTvLineItemBreakdownSlide} from './slides/streaming-tv-line-item-breakdown/streaming-tv-line-item-breakdown.slide'
import {StreamingTvAppBreakdownSlide} from './slides/streaming-tv-app-breakdown/streaming-tv-app-breakdown.slide'
import {StreamingRadioOverviewSlide} from './slides/streaming-radio-overview/streaming-radio-overview.slide'
import {StreamingRadioBreakdownSlide} from './slides/streaming-radio-breakdown/streaming-radio-breakdown.slide'
import {StreamingRadioLineItemBreakdownSlide} from './slides/streaming-radio-line-item-breakdown/streaming-radio-line-item-breakdown.slide'
import {StreamingRadioAppBreakdownSlide} from './slides/streaming-radio-app-breakdown/streaming-radio-app-breakdown.slide'
import {YoutubeOverviewSlide} from './slides/youtube-overview/youtube-overview.slide'
import {YoutubeBreakdownSlide} from './slides/youtube-breakdown/youtube-breakdown.slide'
import {PrerollVideoOverviewSlide} from './slides/preroll-video-overview/preroll-video-overview.slide'
import {PrerollVideoBreakdownSlide} from './slides/preroll-video-breakdown/preroll-video-breakdown.slide'
import {PrerollVideoAppBreakdownSlide} from './slides/preroll-video-app-breakdown/preroll-video-app-breakdown.slide'
import {ExtendedNetworkDisplayOverviewSlide} from './slides/extended-network-display-overview/extended-network-display-overview.slide'
import {ExtendedNetworkDisplayBreakdownSlide} from './slides/extended-network-display-breakdown/extended-network-display-breakdown.slide'
import {ExtendedNetworkDisplayLineItemBreakdownSlide} from './slides/extended-network-display-line-item-breakdown/extended-network-display-line-item-breakdown.slide'
import {GoogleSearchOverviewSlide} from './slides/google-search-overview/google-search-overview.slide'
import {GoogleSearchBreakdownSlide} from './slides/google-search-breakdown/google-search-breakdown.slide'
import {FacebookOverviewSlide} from './slides/facebook-overview/facebook-overview.slide'
import {FacebookBreakdownSlide} from './slides/facebook-breakdown/facebook-breakdown.slide'
import {FacebookAdSetBreakdownSlide} from './slides/facebook-ad-set-breakdown/facebook-ad-set-breakdown.slide'
import {FacebookCampaignBreakdownSlide} from './slides/facebook-campaign-breakdown/facebook-campaign-breakdown.slide'
import {SiteImpactOverviewSlide} from './slides/site-impact-overview/site-impact-overview.slide'
import {SiteImpactBreakdownSlide} from './slides/site-impact-breakdown/site-impact-breakdown.slide'
import {GoogleAnalyticsOverviewSlide} from './slides/google-analytics-overview/google-analytics-overview.slide'
import {GoogleAnalyticsChannelBreakdownSlide} from './slides/google-analytics-channel-breakdown/google-analytics-channel-breakdown.slide'
import {BrandedContentOverviewSlide} from './slides/branded-content-overview/branded-content-overview.slide'
import {BrandedContentArticleBreakdownSlide} from './slides/branded-content-article-breakdown/branded-content-article-breakdown.slide'
import {ThankYouSlide} from './slides/thank-you/thank-you.slide';
import { SemKeywordBreakdownComponent } from './slides/sem-keyword-breakdown/sem-keyword-breakdown.component';
import { AmazonVideoComponent } from './slides/amazon-video/amazon-video.component';
import { AmazonVideoBreakdownComponent } from './slides/amazon-video-breakdown/amazon-video-breakdown.component';
import { AmazonVideoLineItemBreakdownComponent } from './slides/amazon-video-line-item-breakdown/amazon-video-line-item-breakdown.component';
import { AmazonDisplayOverviewComponent } from './slides/amazon-display-overview/amazon-display-overview.component';
import { AmazonDisplayLineItemBreakdownComponent } from './slides/amazon-display-line-item-breakdown/amazon-display-line-item-breakdown.component';
import { AmazonDisplayBreakdownComponent } from './slides/amazon-display-breakdown/amazon-display-breakdown.component';
import { SocialOverviewComponent } from './slides/social-overview/social-overview.component';
import { PremiumProgrammaticVideoOverviewComponent } from './slides/premium-programmatic-video-overview/premium-programmatic-video-overview.component';
import { PremiumProgrammaticVideoBreakdownComponent } from './slides/premium-programmatic-video-breakdown/premium-programmatic-video-breakdown.component';
import { PremiumProgrammaticVideoLineItemBreakdownComponent } from './slides/premium-programmatic-video-line-item-breakdown/premium-programmatic-video-line-item-breakdown.component';
import { TiktokComponent } from './slides/tiktok/tiktok.component';
import { GoogleAdsComponent } from './slides/google-ads/google-ads.component';
import { SiteImpactTopCreativeComponent } from './slides/site-impact-top-creative/site-impact-top-creative.component';
import { TiktokLineItemBreakdownComponent } from './slides/tiktok-line-item-breakdown/tiktok-line-item-breakdown.component';
import { GlossaryComponent } from './slides/glossary/glossary.component';
import { Glossary2Component } from './slides/glossary2/glossary2.component';
import { Glossary3Component } from './slides/glossary3/glossary3.component';
import { Glossary4Component } from './slides/glossary4/glossary4.component';
import { Glossary5Component } from './slides/glossary5/glossary5.component';
import { KeyTermsKnowComponent } from './slides/key-terms-know/key-terms-know.component';
import { KeyTermsKnow2Component } from './slides/key-terms-know2/key-terms-know2.component';
import { CTRReportComponent } from './slides/ctr-report/ctr-report.component';
import { CTRReportMainComponent } from './slides/ctr-report-main/ctr-report-main.component';
import { ExtendedNetworkDisplayGeoComponent } from './slides/extended-network-display-geo/extended-network-display-geo.component';
import { TiktokBreakdownComponent } from './slides/tiktok-breakdown/tiktok-breakdown.component';
import { GeofencingOverviewComponent } from './slides/geofencing-overview/geofencing-overview.component';
import { GeofencingCampaignsComponent } from './slides/geofencing-campaigns/geofencing-campaigns.component';
import { GeofencingCreativesComponent } from './slides/geofencing-creatives/geofencing-creatives.component';
import { GeofencingGeoComponent } from './slides/geofencing-geo/geofencing-geo.component'
import { LinkedInOverviewComponent } from './slides/linkedin-overview/linkedin-overview.component';
import { LinkedInCampaignPerformanceComponent } from './slides/linkedin-campaign-performance/linkedin-campaign-performance.component';
import { LinkedInCreativePerformanceComponent } from './slides/linkedin-creative-performance/linkedin-creative-performance.component';
import { LinkedInGeoComponent } from './slides/linkedin-geo/linkedin-geo.component';
@NgModule({
  declarations: [
    AppComponent,
    SlideHeaderComponent,
    SlideFooterComponent,
    GamCreativeComponent,
    OverviewComponent,
    TheAdvocateTableComponent,
    CoverSlide,
    OverviewSlide,
    OnsiteDisplayOverviewSlide,
    OnsiteDisplayBreakdownSlide,
    OnsiteDisplayLineItemBreakdownSlide,
    OnsiteDisplayMetroBreakdownSlide,
    OnsiteVideoOverviewSlide,
    OnsiteVideoBreakdownSlide,
    OnsiteVideoMetroBreakdownSlide,
    NewslettersOverviewSlide,
    NewslettersBreakdownSlide,
    NewslettersLineItemBreakdownSlide,
    NewslettersMetroBreakdownSlide,
    StreamingTvOverviewSlide,
    StreamingTvBreakdownSlide,
    StreamingTvLineItemBreakdownSlide,
    StreamingTvAppBreakdownSlide,
    StreamingRadioOverviewSlide,
    StreamingRadioBreakdownSlide,
    StreamingRadioLineItemBreakdownSlide,
    StreamingRadioAppBreakdownSlide,
    YoutubeOverviewSlide,
    YoutubeBreakdownSlide,
    PrerollVideoOverviewSlide,
    PrerollVideoBreakdownSlide,
    PrerollVideoAppBreakdownSlide,
    ExtendedNetworkDisplayOverviewSlide,
    ExtendedNetworkDisplayBreakdownSlide,
    ExtendedNetworkDisplayLineItemBreakdownSlide,
    GoogleSearchOverviewSlide,
    GoogleSearchBreakdownSlide,
    FacebookOverviewSlide,
    FacebookBreakdownSlide,
    FacebookAdSetBreakdownSlide,
    FacebookCampaignBreakdownSlide,
    SiteImpactOverviewSlide,
    SiteImpactBreakdownSlide,
    GoogleAnalyticsOverviewSlide,
    GoogleAnalyticsChannelBreakdownSlide,
    BrandedContentOverviewSlide,
    BrandedContentArticleBreakdownSlide,
    ThankYouSlide,
    DividerComponent,
    SemKeywordBreakdownComponent,
    AmazonVideoComponent,
    AmazonVideoBreakdownComponent,
    AmazonVideoLineItemBreakdownComponent,
    AmazonDisplayOverviewComponent,
    AmazonDisplayLineItemBreakdownComponent,
    AmazonDisplayBreakdownComponent,
    SocialOverviewComponent,
    PremiumProgrammaticVideoOverviewComponent,
    PremiumProgrammaticVideoBreakdownComponent,
    PremiumProgrammaticVideoLineItemBreakdownComponent,
    TiktokComponent,
    GoogleAdsComponent,
    SiteImpactTopCreativeComponent,
    TiktokLineItemBreakdownComponent,
    GlossaryComponent,
    Glossary2Component,
    Glossary3Component,
    Glossary4Component,
    Glossary5Component,
    KeyTermsKnowComponent,
    KeyTermsKnow2Component,
    CTRReportComponent,
    CTRReportMainComponent,
    ExtendedNetworkDisplayGeoComponent,
    TiktokBreakdownComponent,
    GeofencingOverviewComponent,
    GeofencingCampaignsComponent,
    GeofencingCreativesComponent,
    GeofencingGeoComponent,
    LinkedInOverviewComponent,
    LinkedInCampaignPerformanceComponent,
    LinkedInCreativePerformanceComponent,
    LinkedInGeoComponent,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: TheAdvocateDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: TheAdvocateVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
