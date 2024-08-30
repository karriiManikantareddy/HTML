import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
  transform(value: any, options?: {pattern: string}): string {
    if (value == null) {
      return 'n/a'
    }

    try {
      let date: Date
      if (value instanceof Date) {
        date = value
      } else {
         date = Date.create(value)
      }
      const pattern: string = options && Object.get(options, 'pattern') || '{Mon} {d}, {year}'
      return date.format(pattern)
    } catch (error) {
      return 'n/a'
    }
  }
}
