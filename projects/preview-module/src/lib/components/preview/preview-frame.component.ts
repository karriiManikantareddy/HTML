import { Component, ElementRef, Input, Pipe, AfterViewInit, ViewChild, Inject} from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { PreviewState } from '../../preview.state'
import { WINDOW } from 'projects/template-module/src/public_api'
import { SettingUpdaterState } from '../../setting-updater.state'

@Component({
  selector: 'preview-frame',
  templateUrl: './preview-frame.component.html',
  styleUrls: ['./preview-frame.component.less']
})
export class PreviewFrameComponent implements AfterViewInit {
  previewUrl: string
  @ViewChild('iframe', { static: true }) iframe: ElementRef

  constructor(@Inject(WINDOW) window: Window, private previewState: PreviewState, private settingUpdaterState: SettingUpdaterState) {
    const location = window.location
    this.previewUrl = `//localhost:5001${location.pathname}${location.search}`
  }

  ngAfterViewInit() {
    this.previewState.setFrame(this.iframe)
    this.settingUpdaterState.setFrame(this.iframe)
  }

  onResize(event) {
    this.previewState.windowResized()
  }

  onPreviewLoad() {
    this.previewState.windowResized()
  }
}

@Pipe({name: 'trustResourceUrl'})
export class TrustResourceUrl {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeResourceUrl {
    if (!value) return
    return this.sanitizer.bypassSecurityTrustResourceUrl(value)
  }
}
