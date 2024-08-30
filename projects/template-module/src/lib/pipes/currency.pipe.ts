import { Inject, Injectable, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { CurrencyPipe as NgCurrencyPipe } from '@angular/common'

@Pipe({ name: 'currency' })
@Injectable()
export class CurrencyPipe implements PipeTransform {
  private pipe: NgCurrencyPipe

  private currencyCode = 'USD'
  private symbolDisplay = 'symbol'

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new NgCurrencyPipe(locale)
  }

  transform(
    value: number,
    options?: { currency?: string; symbolDisplay?: string; digits?: string }): string {
    if (value == null || isNaN(+value)) {
      return 'n/a'
    }
    const opts = Object.merge({
      currency: this.currencyCode,
      symbolDisplay: this.symbolDisplay,
      digits: '1.2-2'
    }, options)
    return this.pipe.transform(value, opts['currency'], opts['symbolDisplay'], opts['digits']) || 'n/a'
  }
}
