import {expect} from 'chai'
import {forEach} from 'lodash'
import {Errors, defaultConfig} from '../src/common'

const generateAlteredErrors = () => {
  const newErrors = {}
  forEach(Errors, (errValue, key) => {
    newErrors[key] = errValue + '*'
  })
  return newErrors
}

export const AlteredErrors = generateAlteredErrors()

// this function aims to make sure every validator function calls return has been processed by
// // CommonTestConfiguration.formatError function.
const alterErrorForTest = (error) => {
  return {
    error: error.error + '*',
    params: error.params
  }
}

export const CommonTestConfiguration = Object.assign({}, defaultConfig, {formatError: alterErrorForTest})

export const testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty = (validatorFunction) => {
  it('returns null when given undefined', function () {
    const ret = validatorFunction({value: undefined, config: CommonTestConfiguration})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = validatorFunction({value: null, config: CommonTestConfiguration})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = validatorFunction({value: '', config: CommonTestConfiguration})
    expect(ret).to.equal(null)
  })
}
export const testThatValidatorHandlesValidAndInvalidValue = (validatorName, validatorFunction, validValue, invalidValue, expectedError) => {
  it('returns null when given a valid value', function () {
    const ret = validatorFunction({value: validValue, config: CommonTestConfiguration})
    expect(ret).to.equal(null)
  })

  it(`returns Error.${validatorName} when given an invalid value`, function () {
    const expected = expectedError || Errors[validatorName]
    const ret = validatorFunction({value: invalidValue, config: CommonTestConfiguration})
    expect(ret).to.deep.equal(expected)
  })
}

export const testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty = (makeValidator, validValue) => {
  const validator = makeValidator('otherField', 'otherFieldLabel')
  it('returns null when other field is undefined', function () {
    const ret = validator({
      value: validValue,
      otherField: undefined,
      otherFieldLabel: 'otherFieldLabel',
      config: CommonTestConfiguration
    })
    expect(ret).to.equal(null)
  })

  it('returns null when other field is null', function () {
    const ret = validator({
      value: validValue,
      otherField: null,
      config: CommonTestConfiguration
    })
    expect(ret).to.equal(null)
  })

  it('returns null when other field is an empty string', function () {
    const ret = validator({
      value: validValue,
      otherField: '',
      config: CommonTestConfiguration
    })
    expect(ret).to.equal(null)
  })
}
