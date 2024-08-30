import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {BurtVariables} from './variables'
import {NumericInputComponent} from './components/numeric-input/numeric-input.component'
import {LaptopContainerComponent} from './components/laptop-container/laptop-container.component'
import {MobilePhoneContainerComponent} from './components/mobile-phone-container/mobile-phone-container.component'
import {PCContainerComponent} from './components/pc-container/pc-container.component'
import {SlideFooterComponent} from './components/slide-footer/slide-footer.component'
import {SlideHeaderComponent} from './components/slide-header/slide-header.component'
import {CampaignDataService} from './services/campaign-data.service'
import {CbsiDataService} from './services/cbsi-data.service'
import { CbsiSettingsService } from './services/cbsi-settings.service'

import {CoverSlide} from './slides/cover/cover.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {AdditionalScreenshotMocksSlide} from './slides/additional-screenshot-mocks/additional-screenshot-mocks.slide'
import {PackageDeliveryBreakoutSlide} from './slides/package-delivery-breakout/package-delivery-breakout.slide'
import {CreativeDeliveryBreakoutSlide} from './slides/creative-delivery-breakout/creative-delivery-breakout.slide'
import {ThirdPartyPlacementTopDeliverySlide} from './slides/third-party-placement-top-delivery/third-party-placement-top-delivery.slide'
import {AdditionalInsightsSlide} from './slides/additional-insights/additional-insights.slide'
import {ShowsSlide} from './slides/shows/shows.slide'
import {LocaleNumberPipe} from './pipes/locale-number.pipe'

@NgModule({
  declarations: [
    AppComponent,
    LaptopContainerComponent,
    MobilePhoneContainerComponent,
    NumericInputComponent,
    PCContainerComponent,
    SlideFooterComponent,
    SlideHeaderComponent,

    AdditionalScreenshotMocksSlide,
    CoverSlide,
    OverviewSlide,
    PackageDeliveryBreakoutSlide,
    CreativeDeliveryBreakoutSlide,
    ThirdPartyPlacementTopDeliverySlide,
    AdditionalInsightsSlide,
    ShowsSlide,
    LocaleNumberPipe
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: CbsiDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: BurtVariables},
    CbsiSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
