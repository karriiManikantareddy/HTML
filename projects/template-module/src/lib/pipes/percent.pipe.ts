import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { PercentPipe as NgPercentPipe } from '@angular/common'

@Pipe({ name: 'percent' })
export class PercentPipe implements PipeTransform {
  private pipe: NgPercentPipe

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new NgPercentPipe(locale)
  }

  transform(value: number|null|undefined, options?: string | {digits: string}): string {
    if (value == null || isNaN(+value)) {
      return 'n/a'
    }
    let opts
    if (typeof options === 'string') {
      opts = {digits: options}
    } else {
      opts = Object.merge({
        digits: '1.2-2'
      }, options)
    }
    return this.pipe.transform(value, opts['digits']) || 'n/a'
  }
}
