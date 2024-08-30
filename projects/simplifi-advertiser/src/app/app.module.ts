import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {SimplifiVariables} from './variables'
import {SimplifiDataService} from './services/simplifi-data.service'
import {AdvertiserDataService} from './services/advertiser-data.service'
import {TemplateConfigService} from './services/template-config.service'
import {SimplifiSettingsService} from './services/simplifi-settings.service'

import {SlideHeaderComponent} from './components/slide-header/slide-header.component'
import {OverviewComponent} from './components/overview/overview.component'
import {SimplifiTableComponent} from './components/simplifi-table/simplifi-table.component'
import {SlideFooterComponent} from './components/slide-footer/slide-footer.component'
import {CoverSlide} from './slides/cover/cover.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {YoutubeOverviewSlide} from './slides/youtube-overview/youtube-overview.slide'
import {YoutubeBreakdownSlide} from './slides/youtube-breakdown/youtube-breakdown.slide'
import {YoutubeCampaignBreakdownSlide} from './slides/youtube-campaign-breakdown/youtube-campaign-breakdown.slide'
import {YoutubeKeywordBreakdownSlide} from './slides/youtube-keyword-breakdown/youtube-keyword-breakdown.slide'
import {YoutubeDeviceBreakdownSlide} from './slides/youtube-device-breakdown/youtube-device-breakdown.slide'
import {GoogleSearchOverviewSlide} from './slides/google-search-overview/google-search-overview.slide'
import {GoogleSearchBreakdownSlide} from './slides/google-search-breakdown/google-search-breakdown.slide'
import {GoogleSearchCampaignBreakdownSlide} from './slides/google-search-campaign-breakdown/google-search-campaign-breakdown.slide'
import {GoogleSearchKeywordBreakdownSlide} from './slides/google-search-keyword-breakdown/google-search-keyword-breakdown.slide'
import {GoogleSearchDeviceBreakdownSlide} from './slides/google-search-device-breakdown/google-search-device-breakdown.slide'
import {FacebookOverviewSlide} from './slides/facebook-overview/facebook-overview.slide'
import {FacebookBreakdownSlide} from './slides/facebook-breakdown/facebook-breakdown.slide'
import {FacebookCampaignBreakdownSlide} from './slides/facebook-campaign-breakdown/facebook-campaign-breakdown.slide'
import {FacebookDemographicsSlide} from './slides/facebook-demographics/facebook-demographics.slide'
import {SimplifiMomSlide} from './slides/simplifi-mom/simplifi-mom.slide'
import {SimplifiOverviewSlide} from './slides/simplifi-overview/simplifi-overview.slide'
import {SimplifiBreakdownSlide} from './slides/simplifi-breakdown/simplifi-breakdown.slide'
import {SimplifiHeatmapBreakdownSlide} from './slides/simplifi-heatmap-breakdown/simplifi-heatmap-breakdown.slide'
import {SimplifiStateHeatmapBreakdownSlide} from './slides/simplifi-state-heatmap-breakdown/simplifi-state-heatmap-breakdown.slide'
import {SimplifiCityBreakdownSlide} from './slides/simplifi-city-breakdown/simplifi-city-breakdown.slide'
import {SimplifiDomainBreakdownSlide} from './slides/simplifi-domain-breakdown/simplifi-domain-breakdown.slide'
import {SimplifiAudienceBreakdownSlide} from './slides/simplifi-audience-breakdown/simplifi-audience-breakdown.slide'
import {SimplifiGeofencingBreakdownSlide} from './slides/simplifi-geofencing-breakdown/simplifi-geofencing-breakdown.slide'
import {SimplifiTargetGeofencingBreakdownSlide} from './slides/simplifi-target-geofencing-breakdown/simplifi-target-geofencing-breakdown.slide'
import {SimplifiTacticBreakdownSlide} from './slides/simplifi-tactic-breakdown/simplifi-tactic-breakdown.slide'
import {SimplifiDeviceBreakdownSlide} from './slides/simplifi-device-breakdown/simplifi-device-breakdown.slide'
import {SimplifiKeywordBreakdownSlide} from './slides/simplifi-keyword-breakdown/simplifi-keyword-breakdown.slide'
import {TableOfContentsSlide} from './slides/table-of-contents/table-of-contents.slide'
import {RecommendationsSlide} from './slides/recommendations/recommendations.slide'
import {ThankYouSlide} from './slides/thank-you/thank-you.slide';
import { FacebookDeviceComponent } from './slides/facebook-device/facebook-device.component';
import { FacebookPlatformComponent } from './slides/facebook-platform/facebook-platform.component';
import { FacebookPlacementComponent } from './slides/facebook-placement/facebook-placement.component';
import { FacebookConversionsComponent } from './slides/facebook-conversions/facebook-conversions.component'
import { SimplifiNativeOverviewComponent } from './slides/simplifi-native-overview/simplifi-native-overview.component';
import { SimplifiNativeCampaignBreakdownComponent } from './slides/simplifi-native-campaign-breakdown/simplifi-native-campaign-breakdown.component';
import { SimplifiNativeCreativeBreakdownComponent } from './slides/simplifi-native-creative-breakdown/simplifi-native-creative-breakdown.component';
import { SimplifiNativeDeviceComponent } from './slides/simpifi-native-device/simpifi-native-device.component';
import { SimplifiNativeDomainComponent } from './slides/simpifi-native-domain/simpifi-native-domain.component';
import { SimplifiNativeImageComponent } from './slides/simplifi-native-image/simplifi-native-image.component';
import { FacebookDmaComponent } from './slides/facebook-dma/facebook-dma.component'
@NgModule({
  declarations: [
    AppComponent,
    SlideHeaderComponent,
    SlideFooterComponent,
    OverviewComponent,
    SimplifiTableComponent,
    CoverSlide,
    OverviewSlide,
    YoutubeOverviewSlide,
    YoutubeBreakdownSlide,
    YoutubeCampaignBreakdownSlide,
    YoutubeKeywordBreakdownSlide,
    YoutubeDeviceBreakdownSlide,
    GoogleSearchOverviewSlide,
    GoogleSearchBreakdownSlide,
    GoogleSearchCampaignBreakdownSlide,
    GoogleSearchKeywordBreakdownSlide,
    GoogleSearchDeviceBreakdownSlide,
    FacebookOverviewSlide,
    FacebookCampaignBreakdownSlide,
    FacebookDemographicsSlide,
    FacebookBreakdownSlide,
    SimplifiOverviewSlide,
    SimplifiMomSlide,
    SimplifiBreakdownSlide,
    SimplifiHeatmapBreakdownSlide,
    SimplifiGeofencingBreakdownSlide,
    SimplifiTargetGeofencingBreakdownSlide,
    SimplifiCityBreakdownSlide,
    SimplifiTacticBreakdownSlide,
    SimplifiDeviceBreakdownSlide,
    SimplifiKeywordBreakdownSlide,
    SimplifiDomainBreakdownSlide,
    SimplifiAudienceBreakdownSlide,
    SimplifiStateHeatmapBreakdownSlide,
    TableOfContentsSlide,
    RecommendationsSlide,
    ThankYouSlide,
    FacebookDeviceComponent,
    FacebookPlatformComponent,
    FacebookPlacementComponent,
    FacebookConversionsComponent,
    SimplifiNativeOverviewComponent,
    SimplifiNativeCampaignBreakdownComponent,
    SimplifiNativeCreativeBreakdownComponent,
    SimplifiNativeDeviceComponent,
    SimplifiNativeDomainComponent,
    SimplifiNativeImageComponent,
    FacebookDmaComponent,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: SimplifiDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: SimplifiVariables},
    TemplateConfigService,
    SimplifiSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
