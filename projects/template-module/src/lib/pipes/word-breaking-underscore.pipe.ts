import {Pipe} from '@angular/core'

@Pipe({name: 'wordBreakingUnderscore'})
export class WordBreakingUnderscore {
  constructor() {}

  transform(value: string | undefined): string | undefined {
    if (!value) return
    return value.replace(/_/g, '_<wbr>')
  }
}
