import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
import { TemplateService } from 'projects/template-module/src/public_api'

import { PostMessageService } from 'projects/template-module/src/lib/template.module'

export interface Language {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(
    private templateService: TemplateService,
    private translateService: TranslateService,
    private postMessageService: PostMessageService,
  ) {}

  private availableLanguages: Language[]

  init(params: any, defaultLanguage: string = 'en', availableLanguages: Language[] = [{id: 'en', name: 'English'}]) {
    this.translateService.setDefaultLang(defaultLanguage)
    let currentLanguage = defaultLanguage
    if (params.export_id) {
      this.templateService.getExportState().subscribe(exportState => {
        const language: string =  Object.get(exportState, 'options.language')
        if (language) {
          this.translateService.use(language)
          currentLanguage = language
        }
      })
    } else {
      if (params.language) {
        this.translateService.use(params.language)
        currentLanguage = params.language
      }
    }
    this.postMessageService.send(window.top, 'languagesAdded', {current: currentLanguage, languages: availableLanguages})
  }
}
