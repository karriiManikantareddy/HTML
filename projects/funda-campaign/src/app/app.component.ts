import { Component } from '@angular/core';
import { TranslationService, Language } from 'projects/translation-module/src/lib/services/translation.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  availableLanguages: Language[] = [
    {id: 'nl', name: 'Dutch'}
  ]

  constructor(private translationService: TranslationService) {
    const params = <any> Object.fromQueryString(location.search)
    this.translationService.init(params, 'nl', this.availableLanguages)
  }
}
