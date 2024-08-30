import * as Sugar from 'sugar'
Sugar.Object.extend()
Sugar.Array.extend()
Sugar.Date.extend()
Sugar.Function.extend()
Sugar.Number.extend()
Sugar.RegExp.extend()
Sugar.String.extend()

import { CompletionDivDirective } from './directives/completion-div.directive'

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { WindowModule } from './window.module'

import { QuillModule } from 'ngx-quill'

import { DataService } from './services/data.service'
import { PostMessageService } from './services/post-message.service'
import { TemplateState } from './template.state'
import { TemplateService, Template, Slide } from './services/template.service'

import { SlideComponent } from './components/slide/slide.component'
import { ToggleDirective } from './components/slide/toggle.directive'
import { ChartComponent } from './components/chart/chart.component'
import { IconComponent } from './components/icon/icon.component'
import { LegendComponent } from './components/legend/legend.component'
import { MapComponent } from './components/map/map.component'

import { CurrencyPipe } from './pipes/currency.pipe'
import { DatePipe } from './pipes/date.pipe'
import { NumberPipe } from './pipes/number.pipe'
import { DecimalPipe } from './pipes/decimal.pipe'
import { PercentPipe } from './pipes/percent.pipe'
import { DurationPipe } from './pipes/duration.pipe'
import { FormatPipe } from './pipes/format.pipe'
import { TrustResourceUrl } from './pipes/trust-resource-url.pipe'
import { WordBreakingUnderscore } from './pipes/word-breaking-underscore.pipe'
import { TimePipe } from './pipes/time.pipe'

export { DataService } from './services/data.service'
export { PostMessageService } from './services/post-message.service'
export { TemplateState } from './template.state'
export { TemplateService, Template, Slide, Toggle } from './services/template.service'
export { Variables } from './variables'

import { DfpConnector } from './connectors/dfp.connector'
export { DfpConnector } from './connectors/dfp.connector'
export * from './connectors/models'

import { ImageUploadComponent } from './components/image-upload/image-upload.component'
import { ImageUploadDirective } from './components/image-upload/image-upload.directive'
import { TopCreativePreview } from './components/top-creative-preview/top-creative-preview.component'
import { TopCreativeMetrics } from './components/top-creative-metrics/top-creative-metrics.component'
import { TopCreativeInfo } from './components/top-creative-info/top-creative-info.component'
import { TextEditor } from './components/text-editor/text-editor.component'
import { NumberEditor } from './components/number-editor/number-editor.component'
import { ReversePipe } from './pipes/reverse.pipe'
import { TableValue } from './pipes/table-value.pipe'
import { MAX_BASE_WAIT, MAX_ATTEMPTS } from './services/http.service'

const MODULES = [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  WindowModule,
  QuillModule,
]

const COMPONENTS = [
  ChartComponent,
  IconComponent,
  LegendComponent,
  MapComponent,
  SlideComponent,
  ToggleDirective,

  ImageUploadComponent,
  ImageUploadDirective,
  TopCreativePreview,
  TopCreativeMetrics,
  TopCreativeInfo,
  TextEditor,
  NumberEditor,
]

const DIRECTIVES = [
  CompletionDivDirective
] 

const PIPES = [
  CurrencyPipe,
  DatePipe,
  NumberPipe,
  DecimalPipe,
  PercentPipe,
  DurationPipe,
  TrustResourceUrl,
  WordBreakingUnderscore,
  TimePipe,
  ReversePipe,
  TableValue,
  FormatPipe,
]

const PROVIDERS = [
  DataService,
  PostMessageService,
  TemplateService,
  TemplateState
]

const CONNECTORS = [
  DfpConnector
]

@NgModule({
  imports: [
    MODULES
  ],
  declarations: [
    COMPONENTS,
    PIPES,
    DIRECTIVES
  ],
  exports: [
    MODULES,
    COMPONENTS,
    PIPES,
    DIRECTIVES,
  ],
  providers: [
    PROVIDERS,
    CONNECTORS,
    PIPES,
    {provide: MAX_ATTEMPTS, useValue: 3 },
    {provide: MAX_BASE_WAIT, useValue: 50 }
  ]
})
export class TemplateModule { }
