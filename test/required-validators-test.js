import {expect} from 'chai'
import {Errors} from '../src/errors'
import {getString} from '../src/getters'

import {
  required,
  requiredIfOtherFieldIsTrue,
  requiredIfOtherFieldIsFalse,
  requiredIfOtherFieldEquals,
  requiredIfOtherFieldIsEmpty,
  requiredIfOtherFieldIsGiven
} from '../src/required-validators'

describe('required', function () {
  it('returns Errors.required when given null value', function () {
    const ret = required({value: null, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when given undefined', function () {
    const ret = required({value: undefined, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when given \'\'', function () {
    const ret = required({value: '', transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when given a value', function () {
    const ret = required({value: 'yo', transform: getString})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsTrue', function () {
  it('returns Errors.required when other field value is true and null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: null, siblings: {otherField: true}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is true and undefined value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: undefined, siblings: {otherField: true}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is true and \'\' value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: '', siblings: {otherField: true}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when other field value is true and a valid string given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: 'yo', siblings: {otherField: false}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is false even when null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: '', siblings: {otherField: false}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is undefined even when null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: null, siblings: {}, transform: getString})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsFalse', function () {
  it('returns Errors.required when other field value is false and null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: null, siblings: {otherField: false}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is false and undefined value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: undefined, siblings: {otherField: false}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is false and \'\' value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: '', siblings: {otherField: false}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when other field value is false and a valid string given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: 'yo', siblings: {otherField: true}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is true even when null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: '', siblings: {otherField: true}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is undefined even when null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: null, siblings: {}, transform: getString})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldEquals', function () {
  it('returns null when other field value is undefined', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is null', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {otherField: null}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is empty string', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {otherField: ''}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is not a target value', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {otherField: 'sdfsd'}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is not one of the target values', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate({value: null, siblings: {otherField: 'sdfsd'}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate({value: 'yo', siblings: {otherField: 'test'}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns Error.required when given no value and other field value matches one of expected', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate({value: '', siblings: {otherField: 'test'}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Error.required when given no value and other field value matches expected', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: '', siblings: {otherField: 'test'}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })
})

describe('requiredIfOtherFieldIsEmpty', function () {
  it('returns Error.required when other field value is undefined', function () {
    const validate = requiredIfOtherFieldIsEmpty('otherField')
    const ret = validate({value: null, siblings: {}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Error.required when other field value is null', function () {
    const validate = requiredIfOtherFieldIsEmpty('otherField')
    const ret = validate({value: null, siblings: {otherField: null}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns Errors.required when other field value is empty string', function () {
    const validate = requiredIfOtherFieldIsEmpty('otherField')
    const ret = validate({value: null, siblings: {otherField: ''}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when other field value is given', function () {
    const validate = requiredIfOtherFieldIsEmpty('otherField')
    const ret = validate({value: null, siblings: {otherField: 'sdfsd'}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value', function () {
    const validate = requiredIfOtherFieldIsEmpty('otherField')
    const ret = validate({value: 'yo', siblings: {otherField: null}, transform: getString})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsGiven', function () {
  it('returns null when other field value is undefined', function () {
    const validate = requiredIfOtherFieldIsGiven('otherField')
    const ret = validate({value: null, siblings: {}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is null', function () {
    const validate = requiredIfOtherFieldIsGiven('otherField')
    const ret = validate({value: null, siblings: {otherField: null}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is empty string', function () {
    const validate = requiredIfOtherFieldIsGiven('otherField')
    const ret = validate({value: null, siblings: {otherField: ''}, transform: getString})
    expect(ret).to.equal(null)
  })

  it('returns Errors.required when other field value is given', function () {
    const validate = requiredIfOtherFieldIsGiven('otherField')
    const ret = validate({value: null, siblings: {otherField: 'sdfsd'}, transform: getString})
    expect(ret).to.equal(Errors.required)
  })

  it('returns null when given a value', function () {
    const validate = requiredIfOtherFieldIsGiven('otherField')
    const ret = validate({value: 'yo', siblings: {otherField: null}, transform: getString})
    expect(ret).to.equal(null)
  })
})
