import { HttpClient } from '@angular/common/http'
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { of, Subject } from 'rxjs'
import { catchError, debounceTime, mergeMap } from 'rxjs/operators'
import { TemplateService } from 'projects/template-module/src/lib/services/template.service'
import { WINDOW } from 'projects/template-module/src/lib/window.module'

@Component({
  selector: 'numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.less'],
})
export class NumericInputComponent implements OnChanges, OnInit {
  @Input() max = 100
  @Input() min = 0
  @Input() id = ''
  @Input() value = 0
  @Input() isPercentage = false
  @Output() valueChange = new EventEmitter<number>()

  @ViewChild('inputEl', { static: true }) inputEl?: ElementRef
  @HostBinding('class.small') isSmallValue = false

  context?: string
  currentValue = new Subject<string>()
  exporting = false
  text?: string
  url = ''

  constructor(
    private templateService: TemplateService,
    @Inject(WINDOW) private window: Window,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const params = <any>Object.fromQueryString(this.window.location.search)
    this.exporting = params['export_id']
    this.context = params.context
    if (!this.context) {
      throw new Error("'context' param is required when using text editor")
    }
    if (!this.id) {
      throw new Error("'id' is a required attribute when using text editor")
    }
    this.url = `${this.templateService.templateUrl()}/contexts/${this.context}/texts/${this.id}`
    this.http.get(this.url, { responseType: 'text' })
      .subscribe(text => {
        this.value = +text || this.value
        this.prepareValue()
        this.valueChange.emit(this.value)
      }, () => { })

    if (!this.exporting) {
      this.currentValue
        .pipe(
          debounceTime(500),
          mergeMap(value =>
            this.http.put(
              this.url,
              { id: this.id, text: value },
              { withCredentials: true }
            )
              .pipe(
                catchError(() => of(null))
              )
          ),
        )
        .subscribe()
    }
  }

  ngOnChanges(): void {
    this.prepareValue()
  }

  prepareValue() {
    if (this.value > this.max) {
      this.value = this.max
    } else if (this.value < this.min) {
      this.value = this.min
    }
    this.isSmallValue = this.value < 20
    if (this.inputEl && this.inputEl.nativeElement) {
      this.inputEl.nativeElement.style.width = '10px'
      window.requestAnimationFrame(() => {
        this.inputEl.nativeElement.style.width = `${this.inputEl.nativeElement.scrollWidth + 1}px`
      })
    }
  }

  onKeyPress(): void {
    this.prepareValue()
    this.currentValue.next(this.value.toString())
    this.valueChange.emit(this.value)
  }
}
