import {expect} from 'chai'
import {Errors} from '../src/errors'
import {getString} from '../src/getters'
import {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty
} from './common-test-cases'
import {
  minLength,
  maxLength,
  isEmail,
  oneOf
} from '../src/strings-validators'

describe('minLength', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(minLength(3))
  it('returns null when given a valid value', function () {
    const validate = minLength(3)
    const ret = validate({value: '123', transform: getString})
    expect(ret).to.equal(null)
  })

  it(`returns Error.minLength when given a too long value`, function () {
    const validate = minLength(3)
    const ret = validate({value: '12', transform: getString})
    expect(ret).to.deep.equal({
      error: Errors.minLength,
      params: {value: '12', minLength: 3}
    })
  })
})

describe('maxLength', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(maxLength(3))
  it('returns null when given a valid value', function () {
    const validate = maxLength(3)
    const ret = validate({value: '123', transform: getString})
    expect(ret).to.equal(null)
  })

  it(`returns Error.maxLength when given a too long value`, function () {
    const validate = maxLength(3)
    const ret = validate({value: '1234', transform: getString})
    expect(ret).to.deep.equal({
      error: Errors.maxLength,
      params: {value: '1234', maxLength: 3}
    })
  })
})

describe('isEmail', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isEmail)

  it('returns Errors.isEmail when given a value that do not match regex', function () {
    const ret = isEmail({value: 'test', transform: getString})
    expect(ret).to.deep.equal(Errors.isEmail)
  })

  it('returns null when given a value that matches the regex', function () {
    const ret = isEmail({value: 'test@sample.com', transform: getString})
    expect(ret).to.equal(null)
  })
})

describe('oneOf', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(oneOf(['test']))

  it('throws when given a non array', function () {
    const validator = () => oneOf(12)
    expect(validator).to.throw('Invalid domain array given to oneOf')
  })

  it('throws when given an empty array', function () {
    const validator = () => oneOf([])
    expect(validator).to.throw('Invalid domain array given to oneOf')
  })

  it('returns Errors.oneOf when given a value that do not match domain', function () {
    const validator = oneOf(['test'])
    const ret = validator({value: 'test1', transform: getString})
    expect(ret).to.deep.equal({
      error: Errors.oneOf,
      params: {value: 'test1', domain: ['test']}
    })
  })

  it('returns null when given a value that matches the domain', function () {
    const validator = oneOf(['test'])
    const ret = validator({value: 'test', transform: getString})
    expect(ret).to.equal(null)
  })
})
