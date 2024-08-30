import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {NytVariables} from 'projects/nyt-campaign/src/app/variables'
import {FooterComponent} from 'projects/nyt-campaign/src/app/components/footer/footer.component'
import {NYTMapComponent} from 'projects/nyt-campaign/src/app/components/nyt-map/nyt-map.component'
import {NytDataService} from 'projects/nyt-campaign/src/app/services/nyt-data.service'
import {AdvertiserDataService} from './services/advertiser-data.service'
import { NytSettingsService } from 'projects/nyt-campaign/src/app/services/nyt-settings.service'

// Customzied slides
import {TableOfContentsSlide} from 'projects/nyt-campaign/src/app/slides/02-table-of-contents/table-of-contents.slide'
import {CampaignObjectivesSlide} from 'projects/nyt-campaign/src/app/slides/02.5-campaign-objectives/campaign-objectives.slide'
import {OverviewSlide} from 'projects/nyt-campaign/src/app/slides/03-overview/overview.slide'
import {CoverSlide} from 'projects/nyt-campaign/src/app/slides/01-cover/cover.slide'
import {ThankYouSlide} from 'projects/nyt-campaign/src/app/slides/98-thank-you/thank-you.slide'
import {GlossarySlide} from 'projects/nyt-campaign/src/app/slides/99-glossary/glossary.slide'
import {LineItemsSlide} from 'projects/nyt-campaign/src/app/slides/04-line-items/line-items.slide'
import {TopLineItemSlide} from 'projects/nyt-campaign/src/app/slides/042-top-line-item/top-line-item.slide'
import {LineItemTopComponent} from 'projects/nyt-campaign/src/app/slides/042-top-line-item/line-item-top/line-item-top.component'
import {LineItemsVideoSlide} from 'projects/nyt-campaign/src/app/slides/041-line-items-video/line-items-video.slide'
import {DsmLineItemsSlide} from 'projects/nyt-campaign/src/app/slides/042-dsm-line-items/dsm-line-items.slide'
import {PodcastOverviewSlide} from 'projects/nyt-campaign/src/app/slides/043-podcast-overview/podcast-overview.slide'
import {TopCreativesSlide} from 'projects/nyt-campaign/src/app/slides/05-top-creatives/top-creatives.slide'
import {PlatformsSlide} from 'projects/nyt-campaign/src/app/slides/07-platforms/platforms.slide'
import {GeographicalDistributionSlide} from 'projects/nyt-campaign/src/app/slides/08-geographical-distribution/geographical-distribution.slide'
import {WorldGeographicalDistributionSlide} from 'projects/nyt-campaign/src/app/slides/08.1-world-geographical-distribution/world-geographical-distribution.slide'
import {AsiaGeographicalDistributionSlide} from 'projects/nyt-campaign/src/app/slides/08.2-asia-geographical-distribution/asia-geographical-distribution.slide'
import {EuropeGeographicalDistributionSlide} from 'projects/nyt-campaign/src/app/slides/08.3-europe-geographical-distribution/europe-geographical-distribution.slide'
import {CreativeLeftComponent} from 'projects/nyt-campaign/src/app/slides/05-top-creatives/creative-left/creative-left.component'
import {CreativeTopComponent} from 'projects/nyt-campaign/src/app/slides/05-top-creatives/creative-top/creative-top.component'

import {SummarySlide} from 'projects/nyt-campaign/src/app/slides/991-summary/summary.slide'
import {NativeContentSlide} from 'projects/nyt-campaign/src/app/slides/992-native-content/native-content.slide';
import {NativeContentCoverSlide} from 'projects/nyt-campaign/src/app/slides/990-native-content-cover/native-content-cover.slide';
import {ScreenshotsSlide1} from "projects/nyt-campaign/src/app/slides/10.1-screenshot/screenshot.slide";
import {ScreenshotsSlide2} from "projects/nyt-campaign/src/app/slides/10.2-screenshot/screenshot.slide";
import {ScreenshotsSlide3} from "projects/nyt-campaign/src/app/slides/10.3-screenshot/screenshot.slide";
import {ScreenshotsSlide4} from "projects/nyt-campaign/src/app/slides/10.4-screenshot/screenshot.slide";
import {ScreenshotsSlide5} from "projects/nyt-campaign/src/app/slides/10.5-screenshot/screenshot.slide";

import {NativeLineItemsSlide} from "projects/nyt-campaign/src/app/slides/994-native-line-items/native-line-items.slide";
import {NativeDsmLineItemsSlide} from 'projects/nyt-campaign/src/app/slides/999-native-dsm-line-items/native-dsm-line-items.slide'
import {NativeContentOverviewSlide} from "projects/nyt-campaign/src/app/slides/995-native-content-overview/native-content-overview.slide";
import {NativeContentTopCreativesSlide} from 'projects/nyt-campaign/src/app/slides/996-native-content-top-creatives/native-content-top-creatives.slide';
import {FacebookDeliverySlide} from 'projects/nyt-campaign/src/app/slides/998-facebook-delivery/facebook-delivery.slide';
import {GenericDeliverySlide} from 'projects/nyt-campaign/src/app/slides/9910-generic-delivery/generic-delivery.slide';

import {DeviceAdTypeCtrBenchmarksSlide} from 'projects/nyt-campaign/src/app/slides/09.1-device-ad-type-ctr-benchmarks/device-ad-type-ctr-benchmarks.slide';
import {DeviceAdTypeVcrBenchmarksSlide} from 'projects/nyt-campaign/src/app/slides/09.2-device-ad-type-vcr-benchmarks/device-ad-type-vcr-benchmarks.slide';
import {SectionsCtrGamSlide} from 'projects/nyt-campaign/src/app/slides/09.3-sections-ctr-gam/sections-ctr-gam.slide';
import {SectionsVcrBenchmarksSlide} from 'projects/nyt-campaign/src/app/slides/09.4-sections-vcr-benchmarks/sections-vcr-benchmarks.slide';
import {BenchmarksCoverSlide} from 'projects/nyt-campaign/src/app/slides/09-benchmarks-cover/benchmarks-cover.slide';
import {MotivationSlide} from 'projects/nyt-campaign/src/app/slides/10.05-motivation/motivation.slide'
import {EmotionSlide} from 'projects/nyt-campaign/src/app/slides/10.06-emotion/emotion.slide'
import {InsightsRecommendationsSlide} from 'projects/nyt-campaign/src/app/slides/11-insights-recommendations/insights-recommendations.slide'

import {LocaleNumberPipe} from 'projects/nyt-campaign/src/app/pipes/locale-number.pipe'
import {ScreenshotMobiles} from 'projects/nyt-campaign/src/app/slides/10.05-screenshot-mobiles/screenshot-mobiles.slide'
import {ScreenshotBoxes} from 'projects/nyt-campaign/src/app/slides/10.07-screenshot-boxes/screenshot-boxes.slide'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NYTMapComponent,
    CreativeLeftComponent,
    CreativeTopComponent,

    CoverSlide,
    TableOfContentsSlide,
    CampaignObjectivesSlide,
    OverviewSlide,
    GlossarySlide,
    LineItemsSlide,
    LineItemsVideoSlide,
    PodcastOverviewSlide,
    PlatformsSlide,
    GeographicalDistributionSlide,
    WorldGeographicalDistributionSlide,
    AsiaGeographicalDistributionSlide,
    EuropeGeographicalDistributionSlide,
    TopCreativesSlide,
    ThankYouSlide,
    SummarySlide,
    NativeContentSlide,
    ScreenshotsSlide1,
    ScreenshotsSlide2,
    ScreenshotsSlide3,
    ScreenshotsSlide4,
    ScreenshotsSlide5,
    NativeContentCoverSlide,
    NativeLineItemsSlide,
    NativeContentOverviewSlide,
    TopLineItemSlide,
    DsmLineItemsSlide,
    NativeDsmLineItemsSlide,
    LineItemTopComponent,
    NativeContentTopCreativesSlide,
    FacebookDeliverySlide,
    GenericDeliverySlide,
    DeviceAdTypeCtrBenchmarksSlide,
    DeviceAdTypeVcrBenchmarksSlide,
    SectionsCtrGamSlide,
    SectionsVcrBenchmarksSlide,
    BenchmarksCoverSlide,
    ScreenshotMobiles,
    ScreenshotBoxes,
    MotivationSlide,
    EmotionSlide,
    InsightsRecommendationsSlide,
    LocaleNumberPipe,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: NytDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: NytVariables},
    NytSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
