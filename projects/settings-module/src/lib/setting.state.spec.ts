import { SettingState } from './setting.state'
import { Setting } from './setting.model'
import { HttpClient } from '@angular/common/http'
import { of, timer } from 'rxjs'
import { PostMessageService, TemplateService } from 'projects/template-module/src/public_api'
import { fakeAsync } from '@angular/core/testing'

const setup = () => {
  const lineitemFilter: Setting<string> = {
    id: 'lineitemfilter',
    name: 'Filter Lineitems',
    componentType: 'dropdown',
    data: [
      {
        componentStateId: 'first',
        data: 'first',
      },
      {
        componentStateId: 'second',
        data: 'second',
      },
    ],
    component: {
      ui: [
        { id: 'first', name: 'First' },
        { id: 'second', name: 'Second' },
      ],
      styling: { order: 0 },
    },
    defaultState: 'first',
  }

  const toggleFilter: Setting<boolean> = {
    id: 'togglefilter',
    name: 'Filter lineitem',
    componentType: 'toggle',
    data: [
      { componentStateId: true, data: 'trueData' },
      { componentStateId: false, data: 'falseData' },
    ],
    component: {
      styling: { order: 1 },
    },
    defaultState: true,
  }
  const mockPMS: jasmine.SpyObj<PostMessageService> = jasmine.createSpyObj('PostMessageService', [
    'send',
    'addListener',
  ])
  const mockHttp: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get', 'put'])
  const mockTemplateService: jasmine.SpyObj<TemplateService> = jasmine.createSpyObj('HttpClient', [
    'templateUrl',
  ])
  const mockWindow: any = {
    location: {
      search: '?context=cool',
    },
    top: null,
  }
  mockHttp.get.and.returnValue(of('{"isNice":"yep."}'))
  mockHttp.put.and.returnValue(of(''))
  return {
    settingState: new SettingState(mockPMS, mockWindow, mockTemplateService, mockHttp),
    postMessageService: mockPMS,
    window: mockWindow as Window,
    httpClient: mockHttp,
    settings: [lineitemFilter, toggleFilter],
  }
}

describe('setting state', () => {
  describe('init', () => {
    it('should return setting data when initialized with a setting', done => {
      const { settingState, postMessageService, settings } = setup()
      postMessageService.send.and.returnValue({})
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(postMessageService.send.calls.count()).toBe(1)
        expect(postMessageService.send.calls.mostRecent().args[2]).toEqual(settings)
        done()
      })
    })

    it('should return setting even if init is after subscribe', done => {
      const { settingState, postMessageService, settings } = setup()
      postMessageService.send.and.returnValue({})
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        done()
      })
      settingState.init(settings)
    })

    it('should return setting ', done => {
      const { settingState, settings } = setup()
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        done()
      })
    })

    it('should return new setting when init is run again', done => {
      const { settingState, settings, httpClient } = setup()
      httpClient.get.and.returnValues(of('{}'), of('{"lineitemfilter": "second"}'))
      let ticks = 0
      settingState.settingData('lineitemfilter').subscribe(data => {
        ticks++
        if (ticks === 1) {
          expect(data.data).toEqual('first')
        } else if (ticks === 2) {
          expect(data.data).toEqual('second')
          expect(httpClient.get.calls.count()).toEqual(2)
          done()
        }
      })
      settingState.init(settings)
      timer(500).subscribe(() => {
        settingState.init(settings)
      })
    })

    it('should return setting correctly twice when two subscribe before init  ', done => {
      const { settingState, settings } = setup()
      let subs = 0
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        if (++subs === 2) {
          done()
        }
      })
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        if (++subs === 2) {
          done()
        }
      })
      timer(500).subscribe(() => {
        settingState.init(settings)
      })
    })
  })

  describe('update', () => {
    it('should return updated state when received an update setting', done => {
      const { settingState, postMessageService, settings } = setup()
      postMessageService.send.and.returnValue({})
      let subTicks = 0
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        subTicks++
        if (subTicks === 1) {
          expect(data.data).toEqual('first')
        } else if (subTicks === 2) {
          expect(data.data).toEqual('second')
          done()
        }
      })
      settingState.updateState({ settingId: 'lineitemfilter', newState: 'second' })
    })

    it('should not update lineitemfilter when an invalid settingId is passed to the update method', done => {
      const { settingState, settings } = setup()
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        done()
      })
      settingState.updateState({ settingId: '--', newState: 'second' })
    })

    it('should not update togglefilter when an invalid settingId is passed to the update method', done => {
      const { settingState, settings } = setup()
      settingState.init(settings)
      settingState.settingData('togglefilter').subscribe(data => {
        expect(data.data).toEqual('trueData')
        done()
      })
      settingState.updateState({ settingId: '--', newState: 'second' })
    })

    it('should not update when an invalid state is passed to the update method', () => {
      const { settingState, postMessageService, settings } = setup()
      postMessageService.send.and.returnValue({})
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
      })
      settingState.updateState({ settingId: 'lineitemfilter', newState: '--' })
    })
  })

  describe('get saved states', () => {
    it('should have state if stateStore returns valid json', fakeAsync(() => {
      const { settingState, httpClient, settings } = setup()
      httpClient.get.and.returnValue(of('{"lineitemfilter": "second"}'))
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('second')
      })
      settingState.updateState({ settingId: 'lineitemfilter', newState: 'second' })
    }));

    it('should be able to update when it got a state from the store', done => {
      const { settingState, httpClient, settings } = setup()
      httpClient.get.and.returnValue(of('{"lineitemfilter": "second"}'))
      let subTicks = 0
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        subTicks++
        if (subTicks === 1) {
          expect(data.data).toEqual('second')
        } else if (subTicks === 2) {
          expect(data.data).toEqual('first')
          done()
        }
      })
      settingState.updateState({ settingId: 'lineitemfilter', newState: 'first' })
    })

    it('should work with boolean values', done => {
      const { settingState, httpClient, settings } = setup()
      httpClient.get.and.returnValue(of('{"togglefilter": false}'))
      settingState.init(settings)
      settingState.settingData('togglefilter').subscribe(data => {
        expect(data.data).toEqual('falseData')
        done()
      })
    })

    it('should use default when getting malformed json', done => {
      const { settingState, httpClient, settings } = setup()
      httpClient.get.and.returnValue(of('lineitemfilter": false}'))
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        done()
      })
    })

    it('should use default value if the value from store is invalid', done => {
      const { settingState, httpClient, settings } = setup()
      httpClient.get.and.returnValue(of('{"lineitemfilter": "----"}'))
      settingState.init(settings)
      settingState.settingData('lineitemfilter').subscribe(data => {
        expect(data.data).toEqual('first')
        done()
      })
    })
  })

  describe('update saved states', () => {
    it('should sent put request when the updateMethod is called', done => {
      const { settingState, httpClient, settings } = setup()
      settingState.init(settings)
      settingState.updateState({ settingId: 'lineitemfilter', newState: 'second' })
      expect(httpClient.put.calls.count()).toEqual(1)
      expect(httpClient.put.calls.mostRecent().args[1].text).toEqual('{"lineitemfilter":"second"}')
      settingState.updateState({ settingId: 'togglefilter', newState: false })
      expect(httpClient.put.calls.count()).toEqual(2)
      expect(httpClient.put.calls.mostRecent().args[1].text).toEqual('{"lineitemfilter":"second","togglefilter":false}')
      done()
    })

    it('should send put request when the updateMethod is called twice in a row', done => {
      const { settingState, httpClient, settings } = setup()
      settingState.init(settings)
      settingState.updateState({ settingId: 'togglefilter', newState: true })
      settingState.updateState({ settingId: 'lineitemfilter', newState: 'second' })
      settingState.updateState({ settingId: 'togglefilter', newState: false })
      expect(httpClient.put.calls.count()).toEqual(3)
      expect(httpClient.put.calls.mostRecent().args[1].text).toEqual('{"lineitemfilter":"second","togglefilter":false}')
      done()
    })

    it('should not update stateStore when an invalid state is passed to the update method', () => {
      const { settingState, settings, httpClient } = setup()
      settingState.init(settings)
      expect(httpClient.put.calls.count()).toEqual(0)
      settingState.updateState({ settingId: 'lineitemfilter', newState: '--' })
    })
  })
})
