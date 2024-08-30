import { Observable, forkJoin, of, timer} from 'rxjs'
import { shareReplay, map, delay, retryWhen, mergeMap, delayWhen, tap } from 'rxjs/operators'
import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Schema } from './schema.model'
import { Result } from './result.model'
import { TemplateService } from './template.service'
import { HttpService } from './http.service'

export interface ParamOverrides {
  interval?: string,
  filters?: string,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private uniqueRequests: Record<string, Observable<Schema | Result>> = {};

  constructor(
    private httpService: HttpService,
    private templateService: TemplateService,
  ) {}

  public load(data: string, paramsOverrides: ParamOverrides = {}): Observable<Result> {
    const templateUrl = this.templateService.templateUrl()
    const url = `${templateUrl}/data/${data}/query`

    const params = <HttpParams> Object.add(
      Object.fromQueryString(location.search),
      paramsOverrides
    )
    const key = `${url}?${JSON.stringify(params)}`
    let load$ = this.uniqueRequests[key]
    if (load$ == null) {
      load$ = forkJoin(
        [
          this.loadSchema(templateUrl, data),
          this.httpService.getRequest(url, params),
        ]
      )
      .pipe(
        map(([schema, rawResult]) => new Result(schema, rawResult)),
        shareReplay(),
      )
      this.uniqueRequests[key] = load$
    }
    return <Observable<Result>> load$
  }

  private loadSchema(templateUrl: string, data: string): Observable<Schema> {
    const url = `${templateUrl}/data/${data}/schema`
    let load$ = this.uniqueRequests[url]
    if (load$ == null) {
      const params = <HttpParams> Object.fromQueryString(location.search)
      load$ = this.httpService.getRequest(url, params)
        .pipe(
          map(rawSchema => new Schema(rawSchema)),
          shareReplay()
        )
      this.uniqueRequests[url] = load$
    }
    return <Observable<Schema>> load$
  }
}
