import {Pipe} from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Pipe({name: 'trustResourceUrl'})
export class TrustResourceUrl {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value?: string): SafeResourceUrl | undefined {
    if (!value) return
    return this.sanitizer.bypassSecurityTrustResourceUrl(value)
  }
}
