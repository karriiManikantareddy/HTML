import { inject, TestBed } from '@angular/core/testing'

import { DecimalPipe } from './decimal.pipe'

describe('Pipes', () => {
  describe('Decimal', () => {
    let pipe: DecimalPipe

    beforeEach(() => {
      pipe = new DecimalPipe('en-US')
    })

    it('returns n/a when the value is undefined', () => {
      expect(pipe.transform(undefined)).toEqual('n/a')
    })

    it('handles a value of 0', () => {
      expect(pipe.transform(0)).toEqual('0')
    })

    const tests = [
      { value: 123, result: '123' },
      { value: 12345, result: '12 345' },
      { value: 123456789, result: '123 456 789' },
    ]

    for (const test of tests) {
      it(`transforms ${test.value} to ${test.result}`, () => {
        expect(pipe.transform(test.value)).toEqual(test.result)
      })
    }

    it('is possible to override default digits config with object', () => {
      expect(pipe.transform(0, { format: '1.3-3' })).toEqual('0.000')
    })

    it('is possible to use abbr in the object', () => {
      expect(pipe.transform(1000, { abbr: true })).toEqual('1k')
      expect(pipe.transform(10000, { abbr: true })).toEqual('10k')
    })

    it('uses space as default separator', () => {
      expect(pipe.transform(10000)).toEqual('10 000')
      expect(pipe.transform(20000000)).toEqual('20 000 000')
    })

    it('is possible to use "period" as separator', () => {
      expect(pipe.transform(10000, {separatorName: 'period'})).toEqual('10.000')
      expect(pipe.transform(20000000, {separatorName: 'period'})).toEqual('20.000.000')
    })

    it('is possible to use comma" as separator', () => {
      expect(pipe.transform(10000, {separatorName: 'comma'})).toEqual('10,000')
      expect(pipe.transform(20000000, {separatorName: 'comma'})).toEqual('20,000,000')
    })

    it('is possible to use both "comma" as separator and format', () => {
      expect(pipe.transform(10000, {separatorName: 'comma', format: '1.3-3'})).toEqual('10,000.000')
      expect(pipe.transform(20000000, {separatorName: 'comma', format: '1.3-3'})).toEqual('20,000,000.000')
    })

    describe('when both abbr and format is present', () => {
      it('prioritizes abbr', () => {
        expect(pipe.transform(0, { format: '1.3-3', abbr: true })).toEqual('0')
        expect(pipe.transform(10000, { format: '1.3-3', abbr: true })).toEqual('10k')
        expect(pipe.transform(1000000, { format: '1.3-3', abbr: true })).toEqual('1m')
      })
    })
  })
})
