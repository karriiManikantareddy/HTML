import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

type validSeparators = 'period' | 'comma' | 'space'

@Pipe({ name: 'number' })
export class NumberPipe implements PipeTransform {
  private pipe: DecimalPipe

  private separators = {
    comma: ',',
    period: '.',
    space: ' ',
  }

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new DecimalPipe(locale)
  }

  transform(
    value: number | null | undefined,
    config?: string | { format?: string; abbr?: boolean; separatorName?: validSeparators },
  ): string {
    if (value == null || isNaN(+value)) {
      return 'n/a'
    }
    let _format = ''
    let _abbr = false
    let _separator = ' '
    if (typeof config === 'object') {
      _abbr = config.abbr || false
      _format = config.format || '1.0-0'
      if (config.separatorName) {
        _separator = this.separators[config.separatorName]
      }
    } else if (typeof config === 'string') {
      _format = config
    }
    if (_abbr) {
      return value.abbr()
    }
    const transformed: string = this.pipe.transform(value, _format || '1.0-0') || 'n/a'
    return transformed.replace(/,/g, _separator)
  }
}
