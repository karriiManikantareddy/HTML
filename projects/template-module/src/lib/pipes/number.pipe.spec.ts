import { inject, TestBed } from '@angular/core/testing'

import { NumberPipe } from './number.pipe'

describe('Pipes', () => {
  describe('Number', () => {
    let pipe: NumberPipe

    beforeEach(() => {
      pipe = new NumberPipe('en-US')
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
      it(`${test.value} to ${test.result}`, () => {
        expect(pipe.transform(test.value)).toEqual(test.result)
      })
    }

    it('is possible to override default digits config', () => {
      expect(pipe.transform(0, '1.3-3')).toEqual('0.000')
    })

    it('is possible to override default digits config with object', () => {
      expect(pipe.transform(0, { format: '1.3-3' })).toEqual('0.000')
    })

    it('is possible to use addr in the object', () => {
      expect(pipe.transform(1000, { abbr: true })).toEqual('1k')
      expect(pipe.transform(10000, { abbr: true })).toEqual('10k')
    })

    it('is when abbr is present it is prioritized over format', () => {
      expect(pipe.transform(0, { format: '1.3-3', abbr: true })).toEqual('0')
      expect(pipe.transform(10000, { format: '1.3-3', abbr: true })).toEqual('10k')
      expect(pipe.transform(1000000, { format: '1.3-3', abbr: true })).toEqual('1m')
    })

    it('uses space as default separator', () => {
      expect(pipe.transform(10000)).toEqual('10 000')
      expect(pipe.transform(20000000)).toEqual('20 000 000')
    })

    it('is possible to use "." as separator', () => {
      expect(pipe.transform(10000, {separatorName: 'period'})).toEqual('10.000')
      expect(pipe.transform(20000000, {separatorName: 'period'})).toEqual('20.000.000')
    })

    it('is possible to use "," as separator', () => {
      expect(pipe.transform(10000, {separatorName: 'comma'})).toEqual('10,000')
      expect(pipe.transform(20000000, {separatorName: 'comma'})).toEqual('20,000,000')
    })

    it('is possible to use both "," as separator and format', () => {
      expect(pipe.transform(10000, {separatorName: 'comma', format: '1.3-3'})).toEqual('10,000.000')
      expect(pipe.transform(20000000, {separatorName: 'comma', format: '1.3-3'})).toEqual('20,000,000.000')
    })
  })
})
