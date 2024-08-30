import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, filter, skipWhile } from 'rxjs/operators'
import { SettingData, Setting } from './setting.model'
import { WINDOW } from 'projects/preview-module/src/public_api'
import { PostMessageService, TemplateService } from 'projects/template-module/src/public_api'

@Injectable({ providedIn: 'root' })
export class SettingState {
  private _settings = new Map<string, BehaviorSubject<Setting | null>>()
  private storeUrl: string

  constructor(
    private postMessageService: PostMessageService,
    @Inject(WINDOW) private window: Window,
    templateService: TemplateService,
    private http: HttpClient,
  ) {
    postMessageService.addListener('settingState', this.updateState.bind(this))
    const params = Object.fromQueryString(this.window.location.search) as any
    const context = params.context
    if (!context) {
      throw new Error('"context" param is required when using text editor')
    }
    this.storeUrl = `${templateService.templateUrl()}/contexts/${context}/texts/setting-states`
  }

  init(settings: Setting[]) {
    this.http.get(this.storeUrl, { responseType: 'text' }).subscribe(text => {
      let savedSettings: Setting[] = settings.clone()
      if (text) {
        try {
          const states: Record<string, any> = JSON.parse(text)
          savedSettings = []
          for (const setting of settings) {
            const savedState = states[setting.id]
            if (savedState != null) {
              savedSettings.push(this.updateStateOfSetting({ setting, newState: savedState }))
            } else {
              savedSettings.push(setting)
            }
          }
        } catch (err) {
          console.warn(`couldn't set settings from response "${text}", malformed? Using default`)
        }
      } else {
        console.warn('no saved setting state')
      }
      this.addConfig(savedSettings)
    })
  }

  async updateState({ settingId, newState }: { settingId: string; newState: any }) {
    try {
      this.updateStateLocally({ settingId, newState })
      const states: Record<string, any> = {}
      this._settings.forEach($setting => {
        const setting = $setting.getValue()
        if (setting) {
          states[setting.id] = setting.state
        }
      })
      try {
        if (!this.storeUrl) {
          return
        }
        await this.http
          .put(this.storeUrl, { text: JSON.stringify(states) }, { withCredentials: true })
          .toPromise()
      } catch (err) {
        console.error('failed to update settings in store')
        console.error(err)
      }
    } catch (err) {
      console.error(err)
    }
  }

  settingData(name: string): Observable<SettingData> {
    let $setting = this._settings.get(name)
    if (!$setting) {
      $setting = new BehaviorSubject<Setting | null>(null)
      this._settings.set(name, $setting)
    }
    return $setting.pipe(
      skipWhile(setting => setting === null),
      map((setting: Setting) => {
        try {
          return this.getData(setting)
        } catch (err) {
          console.error(err)
          return null
        }
      }),
      filter(settingData => !!settingData),
    )
  }

  private addConfig(settings: Setting[]): void {
    for (const setting of settings) {
      const $setting = this._settings.get(setting.id)
      if ($setting) {
        $setting.next(setting)
      } else {
        this._settings.set(setting.id, new BehaviorSubject<Setting | null>(setting))
      }
    }
    this.postMessageService.send(this.window.top, 'settingConfig', settings)
  }

  private updateStateLocally({ settingId, newState }: { settingId: string; newState: any }) {
    const $setting = this._settings.get(settingId)
    if (!$setting) {
      console.warn(`tried to update setting ${settingId} but it doesn't exist`)
      return
    }
    const updatedSetting = this.updateStateOfSetting({ newState, setting: $setting.value })
    $setting.next(updatedSetting)
  }

  private updateStateOfSetting(args: { newState: any; setting: Setting }): Setting {
    const possibleStates =
      args.setting.componentType === 'toggle'
        ? [false, true]
        : args.setting.data.map(state => state.componentStateId)
    if (possibleStates.findIndex((state: any) => state === args.newState) === -1) {
      console.warn('the new state is not in the list of valid states, returning old one')
      return args.setting
    }
    const clonedSetting = Object.clone(args.setting, true) as Setting
    clonedSetting.state = args.newState
    return clonedSetting
  }

  private getData(setting: Setting): SettingData {
    const state = setting.state === undefined ? setting.defaultState : setting.state
    const indexOfData = setting.data.findIndex(d => d.componentStateId === state)
    if (indexOfData === -1) {
      throw new Error(`data not found for componentState ${state}`)
    }
    return setting.data[indexOfData]
  }
}
