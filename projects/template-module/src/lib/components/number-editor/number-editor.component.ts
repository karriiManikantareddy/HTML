import { Observable, Subject } from 'rxjs'
import { catchError, debounceTime } from 'rxjs/operators'
import { Component, Inject, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TemplateService } from '../../services/template.service'
import { WINDOW } from 'projects/template-module/src/lib/window.module'

interface QuillEvent {
  html?: string
}

@Component({
  selector: 'number-editor',
  templateUrl: './number-editor.component.html',
  styleUrls: ['./number-editor.component.less']
})
export class NumberEditor implements OnInit, OnChanges {
  @Input('id') textId = ''
  @Input() placeholder = 'Insert text here..'
  @Input() plainText = false
  @Input() defaultText?: string
  @Output() contentChange = new EventEmitter<string | null>()

  exporting = false
  context?: string
  text?: string

  save = new Subject<QuillEvent>()
  editorInstance: any

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
        if (q.html == null && this.defaultText) this.editorInstance.setText(this.defaultText)
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

  onEditorCreated(quill: any) {
    this.editorInstance = quill
  }

  contentChanged(q: QuillEvent) {
    const text = q.html && q.html.replace(/<[^>]*>/g, '')
    if (text !== this.defaultText) {
      this.save.next(q)
    }
    this.contentChange.emit(text)
  }
}
