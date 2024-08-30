import { Inject, LOCALE_ID, Pipe, PipeTransform, Injector, InjectionToken } from '@angular/core'

import { CurrencyPipe } from '../pipes/currency.pipe';
import { DatePipe } from '../pipes/date.pipe';
import { NumberPipe } from '../pipes/number.pipe';
import { PercentPipe } from '../pipes/percent.pipe';
import { DurationPipe } from '../pipes/duration.pipe';
import { DecimalPipe } from '../pipes/decimal.pipe';

@Pipe({ name: 'format' })
export class FormatPipe implements PipeTransform {
  FORMATS = {
    currency: CurrencyPipe,
    date: DatePipe,
    number: NumberPipe,
    percent: PercentPipe,
    revenue: CurrencyPipe,
    time: DurationPipe,
    seconds: DurationPipe,
    decimal: DecimalPipe,
  }

  constructor(@Inject(LOCALE_ID) locale: string) {
    for (const type in this.FORMATS) {
      const formatTypeToken = new InjectionToken(type);
      const injector = Injector.create(
        {
          providers: [
            { provide: LOCALE_ID, useValue: locale },
            { provide: formatTypeToken, useClass: this.FORMATS[type], deps: [LOCALE_ID] }
          ]
        }
      )
      this.FORMATS[type] = injector.get(formatTypeToken);
    }
  }

  transform(value: any, options?: any): any {
    if (value == null) {
      return 'n/a'
    }

    let format
    const opts = {}
    if (options == null || Object.isString(options)) {
      format = options
    } else {
      format = options['format']
      Object.merge(opts, options)
      delete opts['format']
    }

    let pipe = this.FORMATS[format]
    if (!pipe) {
      if (typeof(value) === 'number') {
        pipe = this.FORMATS['number']
      } else {
        return value
      }
    }

    try {
      return pipe.transform(value, opts)
    } catch(e) {
      if (e.toString().includes('InvalidPipeArgument')) {
        return value
      } else {
        throw(e)
      }
    }
  }
}
