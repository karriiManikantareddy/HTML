import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  private pipe: DecimalPipe

  MINUTES = 60
  HOURS = 60 * this.MINUTES

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.pipe = new DecimalPipe(locale)
  }

  transform(value: number, options = {}): string {
    if (value == null || isNaN(+value)) {
      return 'n/a'
    }

    if (value < 0) {
      return '0s'
    }

    const opts = <any> Object.merge({
      include: ['h', 'm', 's']
    }, options)

    const include = opts['include']
    let result = ''
    let hours = 0, minutes = 0, seconds = 0
    if (include.some('h')) {
      hours = include.some('m') ? Math.floor(value / this.HOURS) : Math.round(value / this.HOURS)
      value %= this.HOURS
      if (hours > 0) {
        result += this.pipe.transform(hours) + 'h '
      }
    }
    if (include.some('m')) {
      minutes = include.some('s') ? Math.floor(value / this.MINUTES) : Math.round(value / this.MINUTES)
      value %= this.MINUTES
      if (hours > 0 || minutes > 0) {
        result += this.pipe.transform(minutes) + 'm '
      }
    }
    if (hours < 10 && include.some('s')) {
      seconds = Math.round(value)
      result += this.pipe.transform(seconds) + 's'
    }
    return result.trim()
  }
}
