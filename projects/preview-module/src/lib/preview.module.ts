import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { WindowModule, TemplateModule } from 'projects/template-module/src/public_api'
import { PreviewFrameComponent, TrustResourceUrl } from './components/preview/preview-frame.component'
import { PreviewTogglesComponent } from './components/preview/preview-toggles.component'
import { PreviewState } from './preview.state'
import { PreviewSettingsComponent } from './components/preview/preview-settings.component'
import { Dropdown } from './components/dropdown'

export { PreviewState } from './preview.state'
export { WindowModule, WINDOW } from 'projects/template-module/src/public_api'

const MODULES = [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  WindowModule,
]

const COMPONENTS = [
  PreviewFrameComponent,
  PreviewTogglesComponent,
  PreviewSettingsComponent,
  Dropdown,
]

const PIPES = [
  TrustResourceUrl
]

const PROVIDERS = [
  PreviewState
]

@NgModule({
  imports: [
    MODULES
  ],
  declarations: [
    COMPONENTS,
    PIPES,
  ],
  exports: [
    COMPONENTS,
    MODULES
  ],
  providers: [
    PROVIDERS
  ]
})
export class PreviewModule { }
