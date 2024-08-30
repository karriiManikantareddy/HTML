import {Inject, LOCALE_ID, Pipe} from '@angular/core'
import {DecimalPipe} from '@angular/common'

@Pipe({ name: 'localeNumber' })
export class LocaleNumberPipe {
  private pipe: DecimalPipe

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new DecimalPipe(locale)
  }

  transform(value: number|null|undefined, separator = ','): string {
    if (value == null || isNaN(value))
      return 'n/a'

    let transformed = this.pipe.transform(value, '1.0-0') || 'n/a'
    return transformed.replace(/,/g, separator)
  }
}
