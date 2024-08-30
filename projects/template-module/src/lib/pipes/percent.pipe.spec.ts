import { PercentPipe } from './percent.pipe'

describe('Pipes', () => {
  describe('Percent', () => {
    let pipe

    beforeEach(() => {
      pipe = new PercentPipe('en-US')
    })

    it('handles a value of 0', () => {
      expect(pipe.transform(0)).toEqual('0.00%')
    })

    it('returns n/a when value is undefined', () => {
      expect(pipe.transform(null)).toEqual('n/a')
    })

    it('multiplies by 100 and always keeps 2 decimals', () => {
      expect(pipe.transform(0.25)).toEqual('25.00%')
    })

    it('is possible to override default digits config', () => {
      expect(pipe.transform(0, '1.3-3')).toEqual('0.000%')
    })

    describe('when options is an object', () => {
      it('parses it', () => {
        expect(pipe.transform(0, {digits: '1.3-3'})).toEqual('0.000%')
      })
    })
  })
})
