import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule, Variables} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {EwScrippsVariables} from './variables'
import {EwScrippsDataService} from './services/ew-scripps-data.service'
import {AdvertiserDataService} from './services/advertiser-data.service'

import {SlideHeaderComponent} from './components/slide-header/slide-header.component'
import {OverviewComponent} from './components/overview/overview.component'
import {GamCreativeComponent} from './components/gam-creative/gam-creative.component'
import {ScrippsTableComponent} from './components/scripps-table/scripps-table.component'
import {CoverSlide} from './slides/cover/cover.slide'
import {DividerSlide} from './slides/divider/divider.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {OverviewAttributionSlide} from './slides/overview-attribution/overview-attribution.slide'
import {CallrailOverviewSlide} from './slides/callrail-overview/callrail-overview.slide'
import {CallrailBreakdownSlide} from './slides/callrail-breakdown/callrail-breakdown.slide'
import {GamOverviewSlide} from './slides/gam-overview/gam-overview.slide'
import {GamBreakdownSlide} from './slides/gam-breakdown/gam-breakdown.slide'
import {GamLineItemBreakdownSlide} from './slides/gam-line-item-breakdown/gam-line-item-breakdown.slide'
import {GdnOverviewSlide} from './slides/gdn-overview/gdn-overview.slide'
import {GdnAdGroupBreakdownSlide} from './slides/gdn-ad-group-breakdown/gdn-ad-group-breakdown.slide'
import {GdnBreakdownSlide} from './slides/gdn-breakdown/gdn-breakdown.slide'
import {GoogleSearchOverviewSlide} from './slides/google-search-overview/google-search-overview.slide'
import {GoogleSearchAdGroupBreakdownSlide} from './slides/google-search-ad-group-breakdown/google-search-ad-group-breakdown.slide'
import {GoogleSearchBreakdownSlide} from './slides/google-search-breakdown/google-search-breakdown.slide'
import {GooglePerformanceMaxOverviewSlide} from './slides/google-performance-max-overview/google-performance-max-overview.slide'
import {GooglePerformanceMaxBreakdownSlide} from './slides/google-performance-max-breakdown/google-performance-max-breakdown.slide'
import {GroundtruthOverviewSlide} from './slides/groundtruth-overview/groundtruth-overview.slide'
import {GroundtruthAdgroupBreakdownSlide} from './slides/groundtruth-adgroup-breakdown/groundtruth-adgroup-breakdown.slide'
import {GroundtruthZipBreakdownSlide} from './slides/groundtruth-zip-breakdown/groundtruth-zip-breakdown.slide'
import {GroundtruthBreakdownSlide} from './slides/groundtruth-breakdown/groundtruth-breakdown.slide'
import {FacebookOverviewSlide} from './slides/facebook-overview/facebook-overview.slide'
import {FacebookAdSetBreakdownSlide} from './slides/facebook-ad-set-breakdown/facebook-ad-set-breakdown.slide'
import {FacebookBreakdownSlide} from './slides/facebook-breakdown/facebook-breakdown.slide'
import {MadhiveOverviewSlide} from './slides/madhive-overview/madhive-overview.slide'
import {MadhiveBreakdownSlide} from './slides/madhive-breakdown/madhive-breakdown.slide'
import {MadhivePublisherBreakdownSlide} from './slides/madhive-publisher-breakdown/madhive-publisher-breakdown.slide'
import {SimplifiOverviewSlide} from './slides/simplifi-overview/simplifi-overview.slide'
import {SimplifiCampaignBreakdownSlide} from './slides/simplifi-campaign-breakdown/simplifi-campaign-breakdown.slide'
import {SimplifiBreakdownSlide} from './slides/simplifi-breakdown/simplifi-breakdown.slide'
import {SiteImpactOverviewSlide} from './slides/site-impact-overview/site-impact-overview.slide'
import {SiteImpactBreakdownSlide} from './slides/site-impact-breakdown/site-impact-breakdown.slide'
import {YoutubeOverviewSlide} from './slides/youtube-overview/youtube-overview.slide'
import {YoutubeBreakdownSlide} from './slides/youtube-breakdown/youtube-breakdown.slide'
import {ThankYouSlide} from './slides/thank-you/thank-you.slide'

@NgModule({
  declarations: [
    AppComponent,
    SlideHeaderComponent,
    GamCreativeComponent,
    OverviewComponent,
    OverviewAttributionSlide,
    ScrippsTableComponent,
    CoverSlide,
    OverviewSlide,
    CallrailOverviewSlide,
    CallrailBreakdownSlide,
    GamOverviewSlide,
    GamLineItemBreakdownSlide,
    GamBreakdownSlide,
    GdnOverviewSlide,
    GdnAdGroupBreakdownSlide,
    GdnBreakdownSlide,
    GoogleSearchOverviewSlide,
    GoogleSearchAdGroupBreakdownSlide,
    GoogleSearchBreakdownSlide,
    GooglePerformanceMaxOverviewSlide,
    GooglePerformanceMaxBreakdownSlide,
    GroundtruthOverviewSlide,
    GroundtruthAdgroupBreakdownSlide,
    GroundtruthZipBreakdownSlide,
    GroundtruthBreakdownSlide,
    FacebookOverviewSlide,
    FacebookBreakdownSlide,
    FacebookAdSetBreakdownSlide,
    MadhiveOverviewSlide,
    MadhiveBreakdownSlide,
    MadhivePublisherBreakdownSlide,
    SimplifiOverviewSlide,
    SimplifiCampaignBreakdownSlide,
    SimplifiBreakdownSlide,
    SiteImpactOverviewSlide,
    SiteImpactBreakdownSlide,
    YoutubeOverviewSlide,
    YoutubeBreakdownSlide,
    ThankYouSlide,
    DividerSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: EwScrippsDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: EwScrippsVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
