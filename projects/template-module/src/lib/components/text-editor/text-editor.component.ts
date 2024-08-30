import { Observable, Subject } from 'rxjs'
import { catchError, debounceTime } from 'rxjs/operators'
import { Component, OnInit, ViewChild, ElementRef, Input, Inject, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TemplateService } from '../../services/template.service'
import { WINDOW } from 'projects/template-module/src/lib/window.module'

interface QuillEvent {
  html?: string
  editor?: any
}

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.less']
})
export class TextEditor implements OnInit, OnChanges {
  @Input('id') textId = ''
  @Input() placeholder = 'Insert text here..'
  @Input() plainText = false
  @Input() defaultText?: string
  @Input() callback?: (event: QuillEvent, textId: string) => void
  @Input() maxLength = -1
  @Output() onContentChange: EventEmitter<string> = new EventEmitter<string>()

  exporting = false
  context?: string
  text?: string
  isTemplateReadonly: boolean = false;

  save = new Subject<QuillEvent>()

  modules: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      // ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      // [{ 'font': [] }],
      [{ 'align': [] }],
      // ['clean'],                                         // remove formatting button
      // ['link', 'image', 'video']                         // link and image, video
    ]
  }

  constructor(
    private templateService: TemplateService,
    @Inject(WINDOW) private window: Window,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const params = <any> Object.fromQueryString(window.location.search)
    this.exporting = params['export_id']
    this.context = params.context
    if (!this.context) {
      throw new Error("'context' param is required when using text editor")
    }
    if (!this.textId) {
      throw new Error("'id' is a required attribute when using text editor")
    }

    if (this.plainText) {
      this.modules['toolbar'] = false
    }

    this.isTemplateReadonly = this.templateService.sharedUserTemplate;

    const url = `${this.templateService.templateUrl()}/contexts/${this.context}/texts/${this.textId}`
    this.http.get(url, { responseType: 'text' }).subscribe(text => {
      this.text = text || this.defaultText
    })

    if (!this.exporting) {
      this.save
      .pipe(
        debounceTime(500)
      )
      .subscribe(q => {
        this.http
        .put(
          url,
          {textId: this.textId, text: q.html},
          {withCredentials: true}
        )
        .subscribe(() => {})
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes.defaultText
    if (change && (!this.text || change.previousValue === this.text)) {
      this.text = this.defaultText
    }
  }

  contentChanged(q: QuillEvent) {
    if (this.maxLength > -1 && q.editor.getLength() > this.maxLength) {
      q.editor.deleteText(this.maxLength, q.editor.getLength())
    }
    this.save.next(q)
    if (this.callback != null) {
      this.callback(q, this.textId)
    }
  }
}
