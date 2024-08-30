import { Observable, forkJoin, of, timer, Subject, range } from 'rxjs'
import { shareReplay, map, delay, retryWhen, mergeMap, delayWhen, tap, catchError, filter, startWith, scan, finalize, distinct, pluck } from 'rxjs/operators'
import { Injectable, Inject, NgModule } from '@angular/core'
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { InjectionToken } from '@angular/core'
import { ResourceGroup } from './resource-group.model'

export const MAX_BASE_WAIT = new InjectionToken<number>('maxBaseWaitMs');
export const MAX_ATTEMPTS = new InjectionToken<number>('maxAttempts');

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private nextConnectionId = 1;
  private connectionsPending = new ResourceGroup();
  private _loggingSubscription = this.connectionsPending.resourcesInUse().pipe(
    tap(((i) => { console.debug(`current pending requests ${JSON.stringify(i)}`) }))
  ).subscribe();

  constructor(
    private httpClient: HttpClient,
    @Inject(MAX_BASE_WAIT) private maxBaseWaitMs: number,
    @Inject(MAX_ATTEMPTS) private maxAttempts: number,
  ) { }

  public openConnections(): Observable<number> {
    return this.connectionsPending.resourcesInUse();
  }

  private retryWithBackoff() {
    const id = this.nextConnectionId;
    this.nextConnectionId++
    return (src: Observable<HttpResponse<Object>>) => src.pipe(
      map((response) => {
        if (response.status >= 400 && response.status <= 599) {
          throw response
        } else {
          return response
        }
      }),
      retryWhen(errors => errors.pipe(
        scan((_, error, index) => { return {error: error, attempts: index} }, null),
        map(({error, attempts}) => {
          const errorAsString = JSON.stringify(error)
          if (attempts >= this.maxAttempts) {
            throw error
          }
          else {
            let currentDelay = (Math.pow(2, attempts) * this.maxBaseWaitMs) + (Math.random() * this.maxBaseWaitMs);
            return currentDelay
          }
        }),
        delayWhen(currentDelay => timer(currentDelay))
      )),
      catchError(errorResponse => of(errorResponse)),
      startWith('START' as any),
      filter((a) => {
        if (a === 'START') {
          this.connectionsPending.create(id);
        }
        return a !== 'START'
      }),
      finalize( () => {
        this.connectionsPending.finalize(id);
      }),
      map((response) => {
        return response.body
      }),
    )
  }

  public getRequest(url: string, params: HttpParams) {
    return this.httpClient.get(url, { params: params, withCredentials: true, observe: 'response' })
      .pipe(this.retryWithBackoff());
  }
  public getRequestNoParam(url: string) {
    return this.httpClient.get(url, { withCredentials: true, observe: 'response' })
      .pipe(this.retryWithBackoff());
  }
  public getRequestUnsetCredentials(url) {
    return this.httpClient.get(url)
      .pipe(this.retryWithBackoff());
  }
  public post(url: string, body) {
    return this.httpClient.post(url, body)
      .pipe(this.retryWithBackoff());
  }
}
