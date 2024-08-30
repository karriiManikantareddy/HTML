import {PostMessageService} from 'projects/template-module/src/public_api'
import {Injectable} from '@angular/core'
import {Observable, BehaviorSubject} from 'rxjs'
import { skipWhile } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class TemplateConfigService {
  templateConfigs = new BehaviorSubject<any | undefined>(undefined)

  constructor(postMessageService: PostMessageService) {
    postMessageService.send(window.top, 'requestTemplateConfigs')
    postMessageService.addListener('template_configs', this.setTemplateConfigs.bind(this))
  }

  setTemplateConfigs(data) {
    this.templateConfigs.next(data)
  }

  getTemplateConfigs(): Observable<any | undefined> {
    return this.templateConfigs.pipe(skipWhile(config => !config))
  }
}

