import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Template, Slide } from '../services/template.service'

export class TemplateServiceMock {
  templateUrl(): string {
    return `templateUrl`
  }
  templateId(): string {
    return `templateId`
  }

  getState(): Observable<Object> {
    throw 'not done'
  }

  getExportState(): Observable<Template> {
    throw 'not done'
  }

  getSlides(): Slide[] {
    throw 'not done'
  }

  getUniqueSlides(): Slide[] {
    throw 'not done'
  }
  get sharedUserTemplate() {
    throw 'not done'
  }
}
