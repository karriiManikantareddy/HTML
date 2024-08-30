import { NgModule } from '@angular/core'
import { TemplateModule } from 'projects/template-module/src/public_api'

import { AppComponent } from './app.component'
import { Test1Slide } from './slides/test1/test1.slide'
import { Test2Slide } from './slides/test2/test2.slide'
import { Test3Slide } from './slides/test3/test3.slide'

@NgModule({
  declarations: [
    AppComponent,
    Test1Slide,
    Test2Slide,
    Test3Slide,
  ],
  imports: [
    TemplateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
