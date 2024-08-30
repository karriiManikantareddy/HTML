import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {
  transform(value: Array<any>): Array<any> {
    if (value === undefined || value === null) {
      return []
    }
    return value.slice().reverse()
  }
}
