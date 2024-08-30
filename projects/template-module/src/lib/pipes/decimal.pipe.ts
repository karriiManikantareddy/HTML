import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { NumberPipe } from './number.pipe'

type validSeparators = 'period' | 'comma' | 'space'

@Pipe({ name: 'number' })
export class DecimalPipe implements PipeTransform {
  private pipe: NumberPipe

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new NumberPipe(locale)
  }

  transform(
    value: number | null | undefined,
    config?: { format?: string; abbr?: boolean; separatorName?: validSeparators }
  ): string {
    const cfg = config || {}
    if (!cfg['format']) {
      cfg['format'] = '1.0-2'
    }
    return this.pipe.transform(value, config) || 'n/a'
  }
}
