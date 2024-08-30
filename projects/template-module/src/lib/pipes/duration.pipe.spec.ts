import { DurationPipe } from './duration.pipe'

describe('Pipes', () => {
  describe('Duration', () => {
    let pipe

    beforeEach(() => {
      pipe = new DurationPipe('en-US')
    })

    it('returns n/a when the value is undefined', () => {
      expect(pipe.transform(null)).toEqual('n/a')
    })

    it('handles a value of 0', () => {
      expect(pipe.transform(0)).toEqual('0s')
    })

    it('formats seconds to hours, minutes and seconds', () => {
      expect(pipe.transform(110)).toEqual('1m 50s')
      expect(pipe.transform(30)).toEqual('30s')
      expect(pipe.transform(3600)).toEqual('1h 0m 0s')
      expect(pipe.transform(3601)).toEqual('1h 0m 1s')
      expect(pipe.transform(3726)).toEqual('1h 2m 6s')
    })

    it('includes what you specify in the first parameter', () => {
      const value = 3726
      expect(pipe.transform(value, {include: ['m']})).toEqual('62m')
      expect(pipe.transform(value, {include: ['m', 's']})).toEqual('62m 6s')
      expect(pipe.transform(value, {include: ['h', 'm']})).toEqual('1h 2m')
    })

    it('removes seconds for when hours > 10', () => {
      expect(pipe.transform(6854081)).toEqual('1,903h 54m')
    })
  })
})
