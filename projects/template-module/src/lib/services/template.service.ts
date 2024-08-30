import { empty, from, Observable } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { WINDOW } from '../window.module'
import * as $ from 'jquery'
import { HttpService } from './http.service'

export interface Toggle {
  name: string
  enabled: boolean
}

export interface Slide {
  name: string
  enabled?: boolean
  hideFromToc?: boolean
  toggles: Toggle[]
}

export interface Template {
  slides: Slide[]
}

@Injectable()
export class TemplateService {
  location: Location

  constructor(
    @Inject(WINDOW) window: Window,
    private httpService: HttpService
  ) {
    this.location = window.location
  }

  templateId(): string {
    let templateId = this.location.pathname.slice(1)
    if (templateId.startsWith('templates')) {
      templateId = templateId.slice(10)
    }
    return templateId
  }

  templateUrl(): string {
    const loc = this.location
    let hostname = loc.hostname
    if (hostname == 'localhost' && loc.port.length) {
      hostname = `templates.burthub.test`
    }
    return `//${hostname}/templates/${this.templateId()}`
  }

  getState(): Observable<Object> {
    const params = <any> Object.fromQueryString(this.location.search)
    const context = params.context
    if (context) {
      const url = `${this.templateUrl()}/state/${context}`
      return this.httpService.getRequestUnsetCredentials(url)
    } else {
      return empty()
    }
  }

  getExportState(): Observable<Template> {
    const params = <any> Object.fromQueryString(this.location.search, {deep: true})
    const export_id = params.export_id
    if (export_id) {
      const url = `${this.templateUrl()}/export_payload/${export_id}?${location.search}`
      return <Observable<Template>> this.httpService.getRequestNoParam(url)
    } else {
      const state = {
        slides: [],
        options: params['options']
      }
      return from([state])
    }
  }

  getSlides(): Slide[] {
    const slides = $('slide').toArray()
    return <Slide[]> slides.map((slide: HTMLElement) => {
      const $slide = $(slide)
      const slideName = $slide.attr('name')
      if (!slideName) return null
      const slideHideFromToc = $slide.attr('hideFromToc') == 'true'
      const slideEnabled = $slide.attr('enabled') != 'false'

      const toggles = <Toggle[]> $slide
        .find('[toggle]')
        .toArray()
        .map((toggle: HTMLElement) => {
          const $toggle = $(toggle)
          const toggleName = $toggle.attr('name')
          if (!toggleName) return null
          const toggleEnabled = $toggle.attr('enabled') != 'false'
          return {name: toggleName, enabled: toggleEnabled}
        })
        .compact()
        .unique((toggle) => (<any> toggle).name)

      return {name: slideName, hideFromToc: slideHideFromToc, enabled: slideEnabled, toggles: toggles}
    }).compact()
  }

  getUniqueSlides(): Slide[] {
    return this.getSlides().unique('name')
  }

  get sharedUserTemplate() {
    const params = <any> Object.fromQueryString(this.location.search)
    const shared = params.shared;
    return !!shared;
  }
}
