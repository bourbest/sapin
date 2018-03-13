import {expect} from 'chai'
import {Errors, defaultConfig as config} from '../src/common'
import {
  minLength,
  maxLength,
  isEmail
} from '../src/strings-validators'

describe('minLength', function () {
  it('returns Errors.minLength when given null value', function () {
    const validator = minLength(3)
    const ret = validator({value: null, config})
    expect(ret).to.deep.equal({
      error: Errors.minLength,
      params: {value: null, minLength: 3}
    })
  })

  it('returns Errors.minLength when given undefined value', function () {
    const validator = minLength(3)
    const ret = validator({value: undefined, config})
    expect(ret).to.deep.equal({
      error: Errors.minLength,
      params: {value: undefined, minLength: 3}
    })
  })

  it('returns Errors.minLength when given string not long enough', function () {
    const validator = minLength(3)
    const ret = validator({value: 'yo', config})
    expect(ret).to.deep.equal({
      error: Errors.minLength,
      params: {value: 'yo', minLength: 3}
    })
  })

  it('returns null when given string long enough', function () {
    const validator = minLength(3)
    const ret = validator({value: 'yo!', config})
    expect(ret).to.equal(null)
  })
})

describe('maxLength', function () {
  it('returns Errors.maxLength when given a value too long', function () {
    const validator = maxLength(3)
    const ret = validator({value: 'test', config})
    expect(ret).to.deep.equal({
      error: Errors.maxLength,
      params: {value: 'test', maxLength: 3}
    })
  })

  it('returns null when given undefined value', function () {
    const validator = maxLength(3)
    const ret = validator({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null value', function () {
    const validator = maxLength(3)
    const ret = validator({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns Errors.minLength when given string not too long', function () {
    const validator = maxLength(3)
    const ret = validator({value: 'yo', config})
    expect(ret).to.equal(null)
  })
})

describe('isEmail', function () {
  it('returns Errors.isEmail when given a value that do not match regex', function () {
    const ret = isEmail({value: 'test', config})
    expect(ret).to.deep.equal({
      error: Errors.isEmail,
      params: {value: 'test'}
    })
  })

  it('returns null when given undefined value', function () {
    const ret = isEmail({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null value', function () {
    const ret = isEmail({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isEmail({value: '', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value that matches the regex', function () {
    const ret = isEmail({value: 'test@sample.com', config})
    expect(ret).to.equal(null)
  })
})
