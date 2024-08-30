import { NgModule } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslationService } from './services/translation.service'

import { PostMessageService } from 'projects/template-module/src/lib/template.module'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
  ],
  declarations: [],
  exports: [
    TranslateModule,
  ],
  providers: [
    TranslationService,
    PostMessageService,
  ]
})
export class TranslationModule { }
