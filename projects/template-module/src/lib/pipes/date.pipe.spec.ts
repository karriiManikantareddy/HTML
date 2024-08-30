import { DatePipe } from './date.pipe'

describe('Pipes', () => {
  describe('Date', () => {
    let pipe

    beforeEach(() => {
      pipe = new DatePipe()
    })

    it('defaults to MMM D, YYYY', () => {
      expect(pipe.transform(Date.create('2015-01-01'))).toEqual('Jan 1, 2015')
      expect(pipe.transform(Date.create('2015-01-24'))).toEqual('Jan 24, 2015')
    })

    it('is possible to override the pattern', () => {
      expect(pipe.transform(Date.create('2015-01-01'), {pattern: '{year}-{MM}-{dd}'})).toEqual('2015-01-01')
    })

    it('works with timestamps', () => {
      expect(pipe.transform(1505520000000)).toEqual('Sept 16, 2017')
    })
  })
})
