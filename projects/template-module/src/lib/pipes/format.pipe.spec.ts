import { async, inject, TestBed } from '@angular/core/testing'
import { LOCALE_ID } from '@angular/core'

import { FormatPipe } from './format.pipe'
import { CurrencyPipe } from '../pipes/currency.pipe';
import { DatePipe } from '../pipes/date.pipe';
import { NumberPipe } from '../pipes/number.pipe';
import { PercentPipe } from '../pipes/percent.pipe';
import { DurationPipe } from '../pipes/duration.pipe';

const formats: string[] = <string[]> Object.keys(new FormatPipe('en-US').FORMATS)

describe('Pipes', () => {
  describe('Format', () => {
    let pipe: FormatPipe

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          CurrencyPipe,
          DatePipe,
          NumberPipe,
          PercentPipe,
          FormatPipe,
        ],
        providers: [
          { provide: LOCALE_ID, useValue: 'en-US' }
        ]
      }).compileComponents()
    }))

    beforeEach(inject([LOCALE_ID], (locale) => {
      pipe = new FormatPipe(locale)
    }))

    it('returns n/a when the value is undefined', () => {
      expect(pipe.transform(null)).toEqual('n/a')
    })

    it('defaults the format to number if value if numeric', () => {
      expect(pipe.transform(10000)).toEqual('10 000')
    })

    it('defaults to string for non-numeric values', () => {
      expect(pipe.transform('a string')).toEqual('a string')
    })

    for (const format of formats) {
      it(`${format} pipe returns n/a for non-numeric values`, () => {
        expect(pipe.transform('a string', format)).toEqual('n/a') 
      })

      it(`${format} pipe returns n/a for null`, () => {
        expect(pipe.transform(null, format)).toEqual('n/a') 
      })

      it(`calls the ${format} pipe`, () => {
        const pipeSpy = jasmine.createSpyObj('format', ['transform'])
        pipe.FORMATS[format] = pipeSpy
        pipe.transform(123, format)
        expect(pipeSpy.transform).toHaveBeenCalledWith(123, {})
      })
    }

    describe('when using an options-hash', () => {
      it('defaults the format to number if value if numeric', () => {
        expect(pipe.transform(10000, {})).toEqual('10 000')
      })

      it('defaults to the original value for non-numeric values', () => {
        expect(pipe.transform('a string', {})).toEqual('a string')
      })

      for (const format of formats) {
        it(`passes options to the ${format} pipe`, () => {
          const pipeSpy = jasmine.createSpyObj('format', ['transform'])
          pipe.FORMATS[format] = pipeSpy
          pipe.transform(123, { format: format, hello: 'options'})
          expect(pipeSpy.transform).toHaveBeenCalledWith(123, { hello: 'options' })
        })
      }
    })
  })
})
