import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Component, ElementRef, EventEmitter, OnInit, Output, Inject, Input, ViewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TemplateService } from '../../services/template.service'
import { WINDOW } from 'projects/template-module/src/lib/window.module'
import { PostMessageService } from '../../services/post-message.service'

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('img', { static: false }) img?: ElementRef<HTMLImageElement>

  @Input('id') imageId = ''
  @Input() isLogo = false
  @Input() align = 'center'
  @Output() imageLoad = new EventEmitter<string | null>()
  requestPath: string = ''

  exporting = false
  context = ''
  src: string | null = null
  loaded = false

  fileList = []
  invalidFiles = []

  imageUploaded: boolean = true

  constructor(
    private templateService: TemplateService,
    @Inject(WINDOW) private window: Window,
    private http: HttpClient,
    private postMessageService: PostMessageService
  ) {
  }

  ngOnInit() {
    const params = <any> Object.fromQueryString(window.location.search)
    this.exporting = !!params['export_id']
    this.context = <string> params.context
    if (!this.context) {
      throw new Error("'context' param is required when using image upload")
    }
    if (!this.imageId) {
      throw new Error("'id' is a required attribute when using image upload")
    }

    if (this.isLogo) {
      this.requestPath = `${this.templateService.templateUrl()}/logos`
    } else {
      this.requestPath = `${this.templateService.templateUrl()}/contexts/${this.context}/images`
    }
    this.src = `${this.requestPath}/${this.imageId}`
    if (this.exporting) {
      this.src = `${this.src}?export_id=${params['export_id']}`
    }
  }

  onFileSelected(e: Event) {
    const files = (<HTMLInputElement> e.srcElement).files
    this.onFilesChange(files ? Array.from(files) : [])
  }

  onFilesChange(fileList: File[]): void {
    fileList.forEach(file => {
      this.uploadImage(file)
        .subscribe(() => {
          this.src = `${this.requestPath}/${this.imageId}`
          this.imageLoaded()
        })
    })
  }

  onFileInvalids(fileList: File[]): void {
    if (fileList.length) {
      console.log('Invalid files!', fileList)
      this.postMessageService.send(window.top, 'imageUploadStatus', {title: 'Invalid file type', description: 'Allowed file types are .png and .jpg.', type: 'error'})
    }
  }

  imageLoaded(): void {
    this.imageLoad.emit(this.src)
    this.loaded = true
  }

  deleteImage(): void {
    if (this.src) {
      this.imageLoad.emit(null)
      this.http
        .delete(this.src, {withCredentials: true})
        .subscribe(() => {
          this.imageUploaded = false
          this.loaded = false
          this.src = null
        })
    }
  }

  private uploadImage(file: File): Observable<{}> {
    this.imageUploaded = false
    this.postMessageService.send(window.top, 'imageUploadStatus', {title: 'Uploading image', description: '', type: 'info'})
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const src = reader.result as string
      if (this.img && this.img.nativeElement) {
        this.img.nativeElement.src = src
      }
    }, false)
    reader.readAsDataURL(file)

    return Observable.create((observer: any) => {
      const form: FormData = new FormData()
      const xhr: XMLHttpRequest = new XMLHttpRequest()


      form.append('image_id', <string> this.imageId)
      form.append('file', file, encodeURIComponent(file.name))
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status !== 204) {
            console.log('Error when uploading image')
            this.postMessageService.send(window.top, 'imageUploadStatus', {title: 'Image upload failed', description: '', type: 'error'})
          } else {
            this.imageUploaded = true
            this.postMessageService.send(window.top, 'imageUploadStatus', {title: 'Image upload complete!', description: '', type: 'success'})
          }
          observer.complete()
        }
      }

      xhr.open('POST', <string> this.requestPath, true)
      xhr.withCredentials = true
      xhr.send(form)
    })
  }
}
