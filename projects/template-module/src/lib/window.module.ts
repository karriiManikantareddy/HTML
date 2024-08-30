import { NgModule, FactoryProvider, InjectionToken } from '@angular/core'

export const WINDOW = new InjectionToken<Window>('Window')

export function windowFactory() {
  return window
}

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory
}

@NgModule({
  providers: [windowProvider]
})
export class WindowModule {}
