import {expect} from 'chai'
import {Errors} from "../src/common";
import {
  required,
  requiredIfOtherFieldIsTrue,
  requiredIfOtherFieldIsFalse,
  requiredIfOtherFieldEquals
} from '../src/required-validators'

describe('required', function () {
  it('returns Errors.required when given null value', function () {
    const ret = required(null)
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when given undefined', function () {
    const ret = required(undefined)
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when given \'\'', function () {
  const ret = required('')
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when given a value', function () {
    const ret = required('yo')
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsTrue', function () {
  it('returns Errors.required when other field value is true and null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate(null, {otherField: true})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is true and undefined value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate(undefined, {otherField: true})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is true and \'\' value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate('', {otherField: true})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when other field value is true and a valid string given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate('yo', {otherField: false})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is false even when null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate('', {otherField: false})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is undefined even when null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate(null, {})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsFalse', function () {
  it('returns Errors.required when other field value is false and null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate(null, {otherField: false})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is false and undefined value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate(undefined, {otherField: false})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is false and \'\' value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate('', {otherField: false})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when other field value is false and a valid string given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate('yo', {otherField: true})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is true even when null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate('', {otherField: true})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is undefined even when null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate(null, {})
    expect(ret).to.equal(null)
  })

  //requiredIfOtherFieldEquals
})

describe('requiredIfOtherFieldEquals', function () {
  it('returns null when other field value is undefined', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate(null, {})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is null', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate(null, {otherField: null})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is empty string', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate(null, {otherField: ''})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is not a target value', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate(null, {otherField: 'sdfsd'})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is not one of the target values', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate(null, {otherField: 'sdfsd'})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate('yo', {otherField: 'test'})
    expect(ret).to.equal(null)
  })

  it('returns Error.required when given no value and other field value matches expected', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate('', {otherField: 'test'})
    expect(ret).to.equal(Errors.required)
  })
})
