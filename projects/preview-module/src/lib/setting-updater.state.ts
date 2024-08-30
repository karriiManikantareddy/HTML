import { Observable, BehaviorSubject } from 'rxjs'
import { Injectable, ElementRef } from '@angular/core'
import { PostMessageService } from 'projects/template-module/src/public_api'
import { Setting } from 'projects/settings-module/src/lib/setting.model'

@Injectable({ providedIn: 'root' })
export class SettingUpdaterState {
  private frame: HTMLIFrameElement
  private settings = new BehaviorSubject<Setting[]>([])

  constructor(private postMessageService: PostMessageService) {
    this.postMessageService.addListener('settingConfig', this.receiveConfig.bind(this))
  }

  clearSettings() {
    this.settings.next([])
  }

  setFrame(frame: ElementRef) {
    this.frame = frame.nativeElement
  }

  getSettings(): Observable<Setting[]> {
    return this.settings.asObservable()
  }

  updateState({ settingId, newState }: { settingId: string; newState: any }) {
    const settings = this.settings.getValue()
    let oldSetting: Setting
    const restOfSettings: Setting[] = []
    for (const setting of settings) {
      if (setting.id === settingId) {
        oldSetting = setting
      } else {
        restOfSettings.push(setting)
      }
    }
    if (!oldSetting) {
      throw new Error(`oldSetting: ${settingId} not found`)
    }
    const newSetting = Object.clone(oldSetting, true) as Setting
    newSetting.state = newState
    restOfSettings.push(newSetting)
    const newSettings = restOfSettings.sortBy(setting => setting.component.styling.order)
    this.settings.next(newSettings)
    this.postMessageService.send(this.frame.contentWindow, 'settingState', { settingId, newState })
  }

  private receiveConfig(newSettings: Setting[]) {
    this.settings.next(newSettings.sortBy(setting => setting.component.styling.order))
  }
}
