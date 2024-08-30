import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {AppComponent} from './app.component'
import {Variables} from 'projects/template-module/src/lib/variables'
import {CmgVariables} from './variables'
import {FooterComponent} from './components/footer/footer.component'
import {HeaderLogoComponent} from './components/header-logo/header-logo.component'
import {AdvertiserDataService} from './services/advertiser-data.service'
import {CmgDataService} from './services/cmg-data.service'
import {TemplateConfigService} from './services/template-config.service'

import {CoverSlide} from './slides/cover/cover.slide'
import {OverviewSlide} from './slides/overview/overview.slide'
import {ThankYouSlide} from './slides/thank-you/thank-you.slide'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderLogoComponent,

    CoverSlide,
    OverviewSlide,
    ThankYouSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: CmgDataService, useClass: AdvertiserDataService},
    {provide: Variables, useClass: CmgVariables},
    TemplateConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
