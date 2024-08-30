import { TimePipe } from './time.pipe'

describe('TimePipe', () => {
  let pipe: TimePipe
  beforeEach(() => {
    pipe = new TimePipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return 0:50 min. for 50 with minutes arg', () => {
    expect(pipe.transform(50, 'minutes')).toEqual('0:50 min.')
  })

  it('should return 0:01 min. for 1 with minutes arg', () => {
    expect(pipe.transform(1, 'minutes')).toEqual('0:01 min.')
  })

  it('should return 1:01 min. for 61 with minutes arg', () => {
    expect(pipe.transform(61, 'minutes')).toEqual('1:01 min.')
  })

  it('should return 60:01 min. for 3601 with minutes arg', () => {
    expect(pipe.transform(3601, 'minutes')).toEqual('60:01 min.')
  })

  it('should return n/a for NaN with minutes', () => {
    expect(pipe.transform(NaN, 'minutes')).toEqual('n/a')
  })

  it('should return n/a for \'\' with minutes', () => {
    expect(pipe.transform("", 'minutes')).toEqual('n/a')
  })

  it('should return 1:01 min. for \'61\' with minutes arg', () => {
    expect(pipe.transform('61', 'minutes')).toEqual('1:01 min.')
  })

  it('should throw if no arg was given', () => {
    expect(() => pipe.transform('61')).toThrow()
  })
})
