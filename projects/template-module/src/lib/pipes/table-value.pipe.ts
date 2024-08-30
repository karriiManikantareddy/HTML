import {Pipe, PipeTransform} from '@angular/core'
import {PercentPipe} from './percent.pipe'
import {NumberPipe} from './number.pipe'
import {CurrencyPipe} from './currency.pipe'
import {TimePipe} from './time.pipe'
import {DatePipe} from './date.pipe'

export enum Formats {
  CURRENCY = 'currency',
  DATE = 'date',
  NUMBER = 'number',
  PERCENT = 'percent',
  TIME = 'time',
}

@Pipe({name: 'tableValue'})
export class TableValue implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe,
              private datePipe: DatePipe,
              private numberPipe: NumberPipe,
              private percentPipe: PercentPipe,
              private timePipe: TimePipe,
  ) {}

  transform(value: any, format: Formats, ...options: any[] ) {
    switch (format) {
      case Formats.CURRENCY:
        return this.currencyPipe.transform(value, ...options[0])
      case Formats.DATE:
        return this.datePipe.transform(value, ...options[0])
      case Formats.NUMBER:
        return this.numberPipe.transform(value, ...options[0])
      case Formats.PERCENT:
        return this.percentPipe.transform(value, ...options[0])
      case Formats.TIME:
        return this.timePipe.transform(value, ...options[0])
    }
  }
}
