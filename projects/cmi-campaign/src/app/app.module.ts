import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {CMIVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {CampaignDataService} from './services/campaign-data.service'
import {CmiDataService} from './services/cmi-data.service'

import {CoverSlide} from './slides/01-cover/cover.slide'
import {OverviewSlide} from './slides/02-overview/overview.slide'
import {KeyInsightsSlide} from './slides/03-key-insights/key-insights.slide'
import {VideoSummarySlide} from './slides/04-video-summary/video-summary.slide'
import {VideoCreativeSlide} from './slides/05-video-creative/video-creative.slide'
import {PerformanceOverviewSlide} from './slides/06-performance-overview/performance-overview.slide'
import {DeliveryByScreenSlide} from './slides/07-delivery-by-screen/delivery-by-screen.slide'
import {DeliveryByDaypartSlide} from './slides/08-delivery-by-daypart/delivery-by-daypart.slide'
import {AudienceExtensionVideoAdobeSlide} from './slides/09-audience-extension-video-adobe/audience-extension-video-adobe.slide'
import {AudienceExtensionVideoAlticeSlide} from './slides/10-audience-extension-video-altice/audience-extension-video-altice.slide'
import {AudienceExtensionVideoSimpliFiSlide} from './slides/11-audience-extension-video-simpli.fi/audience-extension-video-simpli.fi.slide'
import {AudienceExtensionVideoGcmDv360Slide} from './slides/12-audience-extension-video-gcm-dv360/audience-extension-video-gcm-dv360.slide'
import {AudienceExtensionVideoGcmYoutubeSlide} from './slides/13-audience-extension-video-gcm-youtube/audience-extension-video-gcm-youtube.slide'
import {AudienceExtensionVideoGcmAmazonSlide} from './slides/14-audience-extension-video-gcm-amazon/audience-extension-video-gcm-amazon.slide'
import {AudienceExtensionVideoVerveSlide} from './slides/15-audience-extension-video-verve/audience-extension-video-verve.slide'
import {AudienceExtensionVideoGeoSlide} from './slides/16-audience-extension-video-geo/audience-extension-video-geo.slide'
import {AudienceExtensionVideoKeywordsSlide} from './slides/17-audience-extension-video-keywords/audience-extension-video-keywords.slide'
import {DisplaySummarySlide} from './slides/18-display-summary/display-summary.slide'
import {DisplayCreativeSlide} from './slides/19-display-creative/display-creative.slide'
import {AudienceExtensionDisplayAdobeSlide} from './slides/20-audience-extension-display-adobe/audience-extension-display-adobe.slide'
import {AudienceExtensionDisplayAlticeSlide} from './slides/21-audience-extension-display-altice/audience-extension-display-altice.slide'
import {AudienceExtensionDisplayGcmDv360Slide} from './slides/22-audience-extension-display-gcm-dv360/audience-extension-display-gcm-dv360.slide'
import {AudienceExtensionDisplayGcmDv360ConversionSlide} from './slides/23-audience-extension-display-gcm-dv360-conversion/audience-extension-display-gcm-dv360-conversion.slide'
import {AudienceExtensionDisplayGcmAmazonSlide} from './slides/24-audience-extension-display-gcm-amazon/audience-extension-display-gcm-amazon.slide'
import {AudienceExtensionDisplayGcmAmazonConversionSlide} from './slides/25-audience-extension-display-gcm-amazon-conversion/audience-extension-display-gcm-amazon-conversion.slide'
import {AudienceExtensionDisplaySimpliFiSlide} from './slides/26-audience-extension-display-simpli.fi/audience-extension-display-simpli.fi.slide'
import {InteractiveDisplaySlide} from './slides/27-interactive-display/interactive-display.slide'
import {CtaDisplayPerformanceSlide} from './slides/28-cta-display-performance/cta-display-performance.slide'
import {AudienceExtensionDisplayGeoSlide} from './slides/29-audience-extension-display-geo/audience-extension-display-geo.slide'
import {AudienceExtensionDisplayKeywordsSlide} from './slides/30-audience-extension-display-keywords/audience-extension-display-keywords.slide'
import {CpaDisplayPerformanceSlide} from './slides/31-cpa-display-performance/cpa-display-performance.slide'
import {SearchSummarySlide} from './slides/32-search-summary/search-summary.slide'
import {SearchPerformanceOverviewSlide} from './slides/33-search-performance-overview/search-performance-overview.slide'
import {SearchPerformanceOverviewTotalSlide} from './slides/34-search-performance-overview-total/search-performance-overview-total.slide'
import {SearchKeywordsPerformanceSlide} from './slides/35-search-keywords-performance/search-keywords-performance.slide'
import {SearchCreativeSlide} from './slides/36-search-creative/search-creative.slide'
import {SearchDeliveryByScreenSlide} from './slides/37-search-delivery-by-screen/search-delivery-by-screen.slide'
import {DfpCreativeSlide} from './slides/38-dfp-creative/dfp-creative.slide'
import {DfpPerformanceOverviewSlide} from './slides/39-dfp-performance-overview/dfp-performance-overview.slide'
import {DfpInteractiveSlide} from './slides/40-dfp-interactive/dfp-interactive.slide'
import {AutoDynamicSummarySlide} from './slides/41-auto-dynamic-summary/auto-dynamic-summary.slide'
import {AutoDynamicPerformanceOverviewTotalSlide} from './slides/42-auto-dynamic-performance-overview-total/auto-dynamic-performance-overview-total.slide'
import {SocialMediaSummarySlide} from './slides/43-social-media-summary/social-media-summary.slide'
import {SocialImpressionsPerformanceOverviewSlide} from './slides/44-social-impressions-performance-overview/social-impressions-performance-overview.slide'
import {SocialClicksPerformanceOverviewSlide} from './slides/45-social-clicks-performance-overview/social-clicks-performance-overview.slide'
import {SocialViewsPerformanceOverviewSlide} from './slides/46-social-views-performance-overview/social-views-performance-overview.slide'
import {SocialLeadsPerformanceOverviewSlide} from './slides/47-social-leads-performance-overview/social-leads-performance-overview.slide'
import {SocialEventsPerformanceOverviewSlide} from './slides/48-social-events-performance-overview/social-events-performance-overview.slide'
import {ListingManagementSummarySlide} from './slides/49-listing-management-summary/listing-management-summary.slide'
import {AudioSummarySlide} from './slides/50-audio-summary/audio-summary.slide'
import {AudioPerformanceOverviewAdobeSlide} from './slides/51-audio-performance-overview-adobe/audio-performance-overview-adobe.slide'
import {AudioPerformanceOverviewGcmSlide} from './slides/52-audio-performance-overview-gcm/audio-performance-overview-gcm.slide'
import {GoogleAnalyticsSlide} from './slides/53-google-analytics/google-analytics.slide'
import {RecommendationsSlide} from './slides/54-recommendations/recommendations.slide'
import { CoverNewComponent } from './slides/cover-new/cover-new.component';
import { CampaignHighlightsComponent } from './slides/campaign-highlights/campaign-highlights.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterNewComponent } from './components/footer-new/footer-new.component';
import { TextBannerComponent } from './components/text-banner/text-banner.component';
import { StreamingPerformanceComponent } from './slides/streaming-performance/streaming-performance.component';
import { VideoSiteComponent } from './slides/video-site/video-site.component';
import { StreamingNetworkComponent } from './slides/streaming-network/streaming-network.component';
import { MonthlySummaryComponent } from './slides/monthly-summary/monthly-summary.component';
import { PerformanceSummaryComponent } from './slides/performance-summary/performance-summary.component';
import { TacticSummaryComponent } from './slides/tactic-summary/tactic-summary.component';
import { VideoPerformanceComponent } from './slides/video-performance/video-performance.component'
import { DisplayPerformanceComponent } from './slides/display-performance/display-performance.component'
import { PaidSearchSummaryComponent } from './slides/paid-search-summary/paid-search-summary.component'
import { CmiTableComponent } from './components/cmi-table/cmi-table.component'
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,

    CoverSlide,
    OverviewSlide,
    KeyInsightsSlide,
    VideoSummarySlide,

    // Video
    VideoCreativeSlide,
    PerformanceOverviewSlide,
    DeliveryByScreenSlide,
    DeliveryByDaypartSlide,
    AudienceExtensionVideoAdobeSlide,
    AudienceExtensionVideoAlticeSlide,
    AudienceExtensionVideoSimpliFiSlide,
    AudienceExtensionVideoGcmDv360Slide,
    AudienceExtensionVideoGcmYoutubeSlide,
    AudienceExtensionVideoGcmAmazonSlide,
    AudienceExtensionVideoVerveSlide,
    AudienceExtensionVideoGeoSlide,
    AudienceExtensionVideoKeywordsSlide,
    // Display
    DisplaySummarySlide,
    DisplayCreativeSlide,
    AudienceExtensionDisplayAdobeSlide,
    AudienceExtensionDisplayAlticeSlide,
    AudienceExtensionDisplayGcmDv360Slide,
    AudienceExtensionDisplayGcmDv360ConversionSlide,
    AudienceExtensionDisplayGcmAmazonSlide,
    AudienceExtensionDisplayGcmAmazonConversionSlide,
    AudienceExtensionDisplaySimpliFiSlide,
    InteractiveDisplaySlide,
    CtaDisplayPerformanceSlide,
    AudienceExtensionDisplayGeoSlide,
    AudienceExtensionDisplayKeywordsSlide,
    CpaDisplayPerformanceSlide,
    SearchSummarySlide,
    SearchPerformanceOverviewSlide,
    SearchPerformanceOverviewTotalSlide,
    SearchKeywordsPerformanceSlide,
    SearchCreativeSlide,
    SearchDeliveryByScreenSlide,
    AutoDynamicSummarySlide,
    AutoDynamicPerformanceOverviewTotalSlide,
    SocialMediaSummarySlide,
    SocialImpressionsPerformanceOverviewSlide,
    SocialClicksPerformanceOverviewSlide,
    SocialViewsPerformanceOverviewSlide,
    SocialLeadsPerformanceOverviewSlide,
    SocialEventsPerformanceOverviewSlide,
    ListingManagementSummarySlide,
    AudioSummarySlide,
    AudioPerformanceOverviewAdobeSlide,
    AudioPerformanceOverviewGcmSlide,
    GoogleAnalyticsSlide,
    RecommendationsSlide,
    DfpCreativeSlide,
    DfpPerformanceOverviewSlide,
    DfpInteractiveSlide,
    CoverNewComponent,
    CampaignHighlightsComponent,
    HeaderComponent,
    FooterNewComponent,
    TextBannerComponent,
    StreamingPerformanceComponent,
    VideoSiteComponent,
    StreamingNetworkComponent,
    MonthlySummaryComponent,
    PerformanceSummaryComponent,
    TacticSummaryComponent,
    VideoPerformanceComponent,
    DisplayPerformanceComponent,
    PaidSearchSummaryComponent,
    CmiTableComponent
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: CmiDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: CMIVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
