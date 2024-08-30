import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {BurtVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {CampaignDataService} from './services/campaign-data.service'
import {NprDataService} from './services/npr-data.service'

import {CoverSlide} from './slides/01-cover/cover.slide'
import {TableOfContentsSlide} from './slides/02-table-of-contents/table-of-contents.slide'
import {OverviewSlide} from './slides/03-overview/overview.slide'
import {CreativeDelivery} from './slides/04-creative-delivery/creative-delivery.slide'
import {PodcastDeliverySlide} from './slides/05-podcast-delivery/podcast-delivery.slide'
import {TopDMAsSlide} from './slides/06-top-dmas/top-dmas.slide'
import {DevicesSlide} from './slides/07-devices/devices.slide'
import {DeliveryByAgeSlide} from './slides/08-delivery-by-age/delivery-by-age.slide'
import {ThankYouSlide} from './slides/09-thank-you/thank-you.slide'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,

    CoverSlide,
    OverviewSlide,
    CreativeDelivery,
    PodcastDeliverySlide,
    TopDMAsSlide,
    DevicesSlide,
    DeliveryByAgeSlide,
    ThankYouSlide,
    TableOfContentsSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: NprDataService, useClass: CampaignDataService},
    {provide: Variables, useClass: BurtVariables},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}