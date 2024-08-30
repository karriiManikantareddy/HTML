import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

declare const Pusher: any

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  private pusher: any;

  constructor() {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true
    })
  }

  subscribeToChannel(name: string) {
    return this.pusher.subscribe(name)
  }
}
