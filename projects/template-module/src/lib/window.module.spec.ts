import { inject, TestBed } from '@angular/core/testing'
import { Inject } from '@angular/core'
import { WINDOW, WindowModule } from './window.module'

class TestService {
  constructor(
    @Inject(WINDOW) public window: string,
  ) { }
}

describe('WindowModule', () => {
  let testService: TestService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WindowModule]
    })
  })

  beforeEach(inject([WINDOW], (window) => {
    testService = new TestService(window)
  }))

  it('should have WINDOW token with type `Window`', () => {
      expect(testService.window['localStorage']).toEqual(<any>window.localStorage)
      expect(testService.window['document']).toEqual(<any>window.document)
  })
})
