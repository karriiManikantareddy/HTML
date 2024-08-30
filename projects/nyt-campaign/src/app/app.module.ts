import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {NytVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {NYTMapComponent} from './components/nyt-map/nyt-map.component'
import {NytDataService} from './services/nyt-data.service'
import {CampaignDataService} from './services/campaign-data.service'

// Customzied slides
import {TableOfContentsSlide} from './slides/02-table-of-contents/table-of-contents.slide'
import {CampaignObjectivesSlide} from './slides/02.5-campaign-objectives/campaign-objectives.slide'
import {OverviewSlide} from './slides/03-overview/overview.slide'
import {CoverSlide} from './slides/01-cover/cover.slide'
import {ThankYouSlide} from './slides/98-thank-you/thank-you.slide'
import {GlossarySlide} from './slides/99-glossary/glossary.slide'
import {LineItemsSlide} from './slides/04-line-items/line-items.slide'
import {LineItemsVideoSlide} from './slides/041-line-items-video/line-items-video.slide'
import {DsmLineItemsSlide} from './slides/042-dsm-line-items/dsm-line-items.slide'
import {TopLineItemSlide} from './slides/042-top-line-item/top-line-item.slide'
import {LineItemTopComponent} from './slides/042-top-line-item/line-item-top/line-item-top.component'
import {PodcastOverviewSlide} from './slides/043-podcast-overview/podcast-overview.slide'
import {TopCreativesSlide} from './slides/05-top-creatives/top-creatives.slide'
import {PlatformsSlide} from './slides/07-platforms/platforms.slide'
import {GeographicalDistributionSlide} from './slides/08-geographical-distribution/geographical-distribution.slide'
import {WorldGeographicalDistributionSlide} from './slides/08.1-world-geographical-distribution/world-geographical-distribution.slide'
import {AsiaGeographicalDistributionSlide} from './slides/08.2-asia-geographical-distribution/asia-geographical-distribution.slide'
import {EuropeGeographicalDistributionSlide} from './slides/08.3-europe-geographical-distribution/europe-geographical-distribution.slide'
import {CreativeLeftComponent} from './slides/05-top-creatives/creative-left/creative-left.component'
import {CreativeTopComponent} from './slides/05-top-creatives/creative-top/creative-top.component'

import {SummarySlide} from './slides/991-summary/summary.slide'
import {NativeContentSlide} from './slides/992-native-content/native-content.slide';
import {ScreenshotsSlide1} from "./slides/10.1-screenshot/screenshot.slide";
import {ScreenshotsSlide2} from "./slides/10.2-screenshot/screenshot.slide";
import {ScreenshotsSlide3} from "./slides/10.3-screenshot/screenshot.slide";
import {ScreenshotsSlide4} from "./slides/10.4-screenshot/screenshot.slide";
import {ScreenshotsSlide5} from "./slides/10.5-screenshot/screenshot.slide";

import {NativeLineItemsSlide} from "./slides/994-native-line-items/native-line-items.slide";
import {NativeDsmLineItemsSlide} from './slides/999-native-dsm-line-items/native-dsm-line-items.slide'
import {NativeContentOverviewSlide} from "./slides/995-native-content-overview/native-content-overview.slide";
import {NativeContentCoverSlide} from './slides/990-native-content-cover/native-content-cover.slide';
import {NativeContentTopCreativesSlide} from './slides/996-native-content-top-creatives/native-content-top-creatives.slide';
import {FacebookDeliverySlide} from './slides/998-facebook-delivery/facebook-delivery.slide';
import {GenericDeliverySlide} from './slides/9910-generic-delivery/generic-delivery.slide';

import {DeviceAdTypeCtrBenchmarksSlide} from './slides/09.1-device-ad-type-ctr-benchmarks/device-ad-type-ctr-benchmarks.slide';
import {DeviceAdTypeVcrBenchmarksSlide} from './slides/09.2-device-ad-type-vcr-benchmarks/device-ad-type-vcr-benchmarks.slide';
import {SectionsCtrGamSlide} from './slides/09.3-sections-ctr-gam/sections-ctr-gam.slide';
import {SectionsVcrBenchmarksSlide} from './slides/09.4-sections-vcr-benchmarks/sections-vcr-benchmarks.slide';
import {BenchmarksCoverSlide} from './slides/09-benchmarks-cover/benchmarks-cover.slide';
import {MotivationSlide} from './slides/10.05-motivation/motivation.slide'
import {EmotionSlide} from './slides/10.06-emotion/emotion.slide'
import {InsightsRecommendationsSlide} from './slides/11-insights-recommendations/insights-recommendations.slide'

import {LocaleNumberPipe} from './pipes/locale-number.pipe'
import { NytSettingsService } from './services/nyt-settings.service'
import { ScreenshotMobiles } from './slides/10.05-screenshot-mobiles/screenshot-mobiles.slide'
import { ScreenshotBoxes } from './slides/10.07-screenshot-boxes/screenshot-boxes.slide';
import { PerformanceOverviewComponent } from './slides/03.5-performance-overview/performance-overview.component';
import { InsightsComponent } from './slides/03.75-insights/insights.component';
import { EngagementsComponent } from './slides/04.5-engagements/engagements.component';
import { TopLineCtrComponent } from './slides/top-line-ctr/top-line-ctr.component';
import { TopCreativeCtrComponent } from './slides/top-creative-ctr/top-creative-ctr.component';
import { CampaignComponent } from './slides/02.25-campaign-objectives/campaign.component';

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
    NativeLineItemsSlide,
    NativeContentOverviewSlide,
    NativeContentCoverSlide,
    TopLineItemSlide,
    NativeContentTopCreativesSlide,
    LineItemTopComponent,
    DsmLineItemsSlide,
    NativeDsmLineItemsSlide,
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
    PerformanceOverviewComponent,
    InsightsComponent,
    EngagementsComponent,
    TopLineCtrComponent,
    TopCreativeCtrComponent,
    CampaignComponent,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: NytDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: NytVariables},
    NytSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
