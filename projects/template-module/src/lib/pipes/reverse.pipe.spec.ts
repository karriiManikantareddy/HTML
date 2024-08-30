import { ReversePipe } from './reverse.pipe'

describe('Pipes', () => {
  describe('Reverse', () => {
    let pipe
    let input

    beforeEach(() => {
      pipe = new ReversePipe()
      input = [1, 2, 3]
    })

    it('returns an empty array when value is null', () => {
      expect(pipe.transform(null)).toEqual([])
    })

    it('does not mutate the input value', () => {
      expect(pipe.transform(input)).not.toEqual(input)
    })
  })
})
