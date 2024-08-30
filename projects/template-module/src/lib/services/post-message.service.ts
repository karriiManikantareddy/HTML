import { Injectable, Inject } from '@angular/core'
import { WINDOW } from '../window.module'

type Listener = (data: any) => void

@Injectable({
  providedIn: 'root'
})
export class PostMessageService {
  private listeners: Partial<Record<string, Listener[]>>

  constructor(@Inject(WINDOW) private window: Window) {
    this.listeners = {}
    if (!window.onmessage) {
      window.onmessage = (e: MessageEvent) => {
        if (Object.isString(e.data)) {
          const raw = <string> e.data
          if (raw.includes('name') && raw.includes('burt-')) {
            const data = JSON.parse(e.data)
            const name = data['name'].slice(5)
            const listeners = this.listeners[name]
            if (listeners) {
              listeners.forEach(listener => listener(data['data']))
            }
          }
        }
      }
    }
  }

  addListener(eventName: string, fn: Listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }
    (<Listener[]> this.listeners[eventName]).push(fn)
  }

  send(recipient: Window, eventName: string, data: any = null) {
    recipient.postMessage(
      JSON.stringify({name: `burt-${eventName}`, data: data}),
      '*' // origin
    )
  }
}