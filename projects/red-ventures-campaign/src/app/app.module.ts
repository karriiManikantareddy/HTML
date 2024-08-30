import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'
import {TemplateModule} from 'projects/template-module/src/public_api'

import {FooterComponent} from 'projects/red-ventures-campaign/src/app/components/footer/footer.component'
import {HeaderComponent} from 'projects/red-ventures-campaign/src/app/components/header/header.component'
import {AppComponent} from './app.component'

// Customzied slides
import {CampaignDataService} from './services/campaign-data.service';
import {RedVenturesDataService} from './services/red-ventures-data.service';

import { CoverSlide } from './slides/01-cover/cover.slide';
import { OverviewSlide } from './slides/03-overview/overview.slide';
import { TopPerformingMediaSlide } from './slides/04-top-performing-media/top-performing-media.slide';
import { LearningsSlide } from './slides/05-learnings/learnings.slide';
import { ThankYouSlide } from './slides/06-thank-you/thank-you.slide';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    CoverSlide,
    OverviewSlide,
    TopPerformingMediaSlide,
    LearningsSlide,
    ThankYouSlide,
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    {provide: RedVenturesDataService, useClass: CampaignDataService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
