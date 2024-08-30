import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(seconds: number | string, args?: any): string {
    if (!seconds || isNaN(+seconds)) {
      return 'n/a'
    }
    if (args === 'minutes') {
      const _seconds = Math.floor(+seconds % 60) + ''
      return `${Math.floor(+seconds / 60)}:${_seconds.length > 1 ? _seconds : '0' + _seconds} min.`
    }
    throw new Error(`"${args}" not implemented`)
  }
}
