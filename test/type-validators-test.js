import {expect} from 'chai'
import {identity} from 'lodash'
import {
  isNumber,
  isOfTypeString,
  isOfTypeObject,
  isOfTypeDate,
  isOfTypeBool,
  isOfTypeArray
} from '../src/type-validators'

import {
  getNumber,
  getString,
  getDate
} from '../src/getters'
import { Errors } from '../src/errors'
import {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty,
  testThatValidatorHandlesValidAndInvalidValue
} from './common-test-cases'

describe('isNumber', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isNumber, getNumber)

  testThatValidatorHandlesValidAndInvalidValue('isNumber', isNumber, getNumber, '0', 'yo!')

  it('returns null when given 0', function () {
    const ret = isNumber({value: 0, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given a number with decimal using the dot', function () {
    const ret = isNumber({value: '1.5', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns Error.isNumber when given a number two dots', function () {
    const ret = isNumber({value: '1.5.9', getter: getNumber})
    expect(ret).to.deep.equal(Errors.isNumber)
  })
})

describe('isOfTypeString', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isOfTypeString, getString)

  testThatValidatorHandlesValidAndInvalidValue('isOfTypeString', isOfTypeString, getString, '0', [])
})

describe('isOfTypeDate', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isOfTypeDate, getDate)

  testThatValidatorHandlesValidAndInvalidValue('isOfTypeDate', isOfTypeDate, getDate, '2017-01-01', 'sdfsadf')
})

describe('isOfTypeBool', function () {
  it('returns null when given false', function () {
    const ret = isOfTypeBool({value: false, getter: identity})
    expect(ret).to.be.null
  })

  it('returns null when given true', function () {
    const ret = isOfTypeBool({value: true, getter: identity})
    expect(ret).to.be.null
  })

  it('returns an error when given a non boolean value', function () {
    const ret = isOfTypeBool({value: '', getter: identity})
    expect(ret).to.equal(Errors.isOfTypeBool)
  })
})

describe('isOfTypeArray', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isOfTypeArray, identity)

  testThatValidatorHandlesValidAndInvalidValue('isOfTypeArray', isOfTypeArray, identity, [], {})
})

describe('isOfTypeObject', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isOfTypeObject, identity)

  testThatValidatorHandlesValidAndInvalidValue('isOfTypeObject', isOfTypeObject, identity, {}, [])
})

