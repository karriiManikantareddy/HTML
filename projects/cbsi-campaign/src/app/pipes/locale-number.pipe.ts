import {Inject, LOCALE_ID, Pipe} from '@angular/core'
import {DecimalPipe} from '@angular/common'

@Pipe({ name: 'localeNumber' })
export class LocaleNumberPipe {
  private pipe

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new DecimalPipe(locale)
  }

  transform(value: number, separator = ','): string {
    if (value == null || isNaN(+value)) {
      return 'n/a'
    }

    let transformed = this.pipe.transform(value, '1.0-0')
    return transformed.replace(/,/g, separator)
  }
}
