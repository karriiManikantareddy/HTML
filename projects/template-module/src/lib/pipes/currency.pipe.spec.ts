import { CurrencyPipe } from './currency.pipe'

describe('Pipes', () => {
  describe('Currency', () => {
    let pipe: CurrencyPipe

    beforeEach(() => {
      pipe = new CurrencyPipe('en-US')
    })

    it('returns n/a when the value is undefined', () => {
      expect(pipe.transform(null)).toEqual('n/a')
    })

    it('handles a value of 0', () => {
      expect(pipe.transform(0)).toEqual('$0.00')
    })

    it('always shows 2 decimals', () => {
      expect(pipe.transform(1)).toEqual('$1.00')
      expect(pipe.transform(1.2)).toEqual('$1.20')
      expect(pipe.transform(1.23)).toEqual('$1.23')
      expect(pipe.transform(2 / 3)).toEqual('$0.67')
    })

    it('is possible to override default currencyCode, symbolDisplay and digits config', () => {
      expect(pipe.transform(100, {currency: 'GBP', symbolDisplay: 'code', digits: '1.0-0'})).toEqual('GBP100')
      expect(pipe.transform(100, {currency: 'GBP', symbolDisplay: 'symbol', digits: '1.0-0'})).toEqual('£100')
    })
  })
})
