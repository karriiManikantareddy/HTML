import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { PreviewModule } from 'projects/preview-module/src/public_api'
import { TemplateModule } from 'projects/template-module/src/public_api'
import { AppComponent } from './app.component'
import { PusherService } from './services/pusher.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PreviewModule,
    TemplateModule,
  ],
  providers: [
    PusherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
