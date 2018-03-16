import {expect} from 'chai'
import {Errors} from '../src/common'
import {
  CommonTestConfiguration as config,
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty
} from './common-test-cases'
import {
  minLength,
  maxLength,
  isEmail
} from '../src/strings-validators'

describe('minLength', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(minLength(3))
  it('returns null when given a valid value', function () {
    const validate = minLength(3)
    const ret = validate({value: '123', config})
    expect(ret).to.equal(null)
  })

  it(`returns Error.minLength when given a too long value`, function () {
    const validate = minLength(3)
    const ret = validate({value: '12', config})
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
    const ret = validate({value: '123', config})
    expect(ret).to.equal(null)
  })

  it(`returns Error.maxLength when given a too long value`, function () {
    const validate = maxLength(3)
    const ret = validate({value: '1234', config})
    expect(ret).to.deep.equal({
      error: Errors.maxLength,
      params: {value: '1234', maxLength: 3}
    })
  })
})

describe('isEmail', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isEmail)

  it('returns Errors.isEmail when given a value that do not match regex', function () {
    const ret = isEmail({value: 'test', config})
    expect(ret).to.deep.equal(Errors.isEmail)
  })

  it('returns null when given a value that matches the regex', function () {
    const ret = isEmail({value: 'test@sample.com', config})
    expect(ret).to.equal(null)
  })
})
