import { Component, Inject, OnInit } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { PreviewState, WINDOW } from 'projects/preview-module/src/public_api'
import { PusherService } from './services/pusher.service'
import { Slide, TemplateService } from 'projects/template-module/src/public_api'
import { HttpService } from 'projects/template-module/src/lib/services/http.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  context: string
  template: string
  channel: string
  generating: boolean
  progressMessage: string

  constructor(
    @Inject(WINDOW) private window: Window,
    private httpService: HttpService,
    private previewState: PreviewState,
    private templateService: TemplateService,
    private pusherService: PusherService
  ) {
    const params = <any> Object.fromQueryString(window.location.search)
    this.context = params.context || 'development-context'
    this.channel = `export-${this.context}`
    this.pusherService
      .subscribeToChannel(this.channel)
      .bind('progress', (event) => {
        const message = event['message']
        if (message.includes('DONE')) {
          this.generating = false
          this.progressMessage = null
          if (message.includes('DONE_PDF') || message.includes('DONE_PPTX')) {
            const url = message.split(' - ')[1]
            window.open(url)
          }
        } else {
          this.progressMessage = message
        }
      })
  }

  ngOnInit() {
    this.template = this.window.location.pathname.slice(1)
  }

  generate(format: string) {
    if (!this.generating) {
      const params = <any> Object.fromQueryString(window.location.search)
      this.generating = true
      this.httpService
        .post('/templates', {
          template: this.template,
          report_format: format,
          export_id: `development-export-${Date.create().getTime()}`,
          context: this.context,
          channel: this.channel,
          slides: this.previewState.slides.getValue(),
          interval: params['interval'],
          options: {
            language: params['language'],
            user: params['user'],
            account: params['account'],
            entities: (params['entities'] || '').split(','),
          }
        })
        .subscribe()
    }
  }
}
