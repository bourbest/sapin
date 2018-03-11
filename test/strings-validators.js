import {expect} from 'chai'
import {Errors} from '../src/common'
import {
  minLength,
  maxLength,
  isEmail
} from '../src/strings-validators'

describe('minLength', function () {
  const minLength3Error = {
    error: Errors.minLength,
    params: {minLength: 3}
  }

  it('returns Errors.minLength when given null value', function () {
    const validator = minLength(3)
    const ret = validator(null)
    expect(ret).to.deep.equal(minLength3Error)
  })

  it('returns Errors.minLength when given undefined value', function () {
    const validator = minLength(3)
    const ret = validator(undefined)
    expect(ret).to.deep.equal(minLength3Error)
  })

  it('returns Errors.minLength when given string not long enough', function () {
    const validator = minLength(3)
    const ret = validator('yo')
    expect(ret).to.deep.equal(minLength3Error)
  })

  it('returns null when given string long enough', function () {
    const validator = minLength(3)
    const ret = validator('yo!')
    expect(ret).to.equal(null)
  })
})

describe('maxLength', function () {
  it('returns Errors.maxLength when given a value too long', function () {
    const validator = maxLength(3)
    const ret = validator('test')
    expect(ret).to.deep.equal({
      error: Errors.maxLength,
      params: {maxLength: 3}
    })
  })

  it('returns null when given undefined value', function () {
    const validator = maxLength(3)
    const ret = validator(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null value', function () {
    const validator = maxLength(3)
    const ret = validator(null)
    expect(ret).to.equal(null)
  })

  it('returns Errors.minLength when given string not too long', function () {
    const validator = maxLength(3)
    const ret = validator('yo')
    expect(ret).to.equal(null)
  })
})

describe('isEmail', function () {
  it('returns Errors.isEmail when given a value that do not match regex', function () {
    const ret = isEmail('test')
    expect(ret).to.equal(Errors.isEmail)
  })

  it('returns null when given undefined value', function () {
    const ret = isEmail(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null value', function () {
    const ret = isEmail(null)
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isEmail('')
    expect(ret).to.equal(null)
  })

  it('returns null when given a value that matches the regex', function () {
    const ret = isEmail('test@sample.com')
    expect(ret).to.equal(null)
  })
})
