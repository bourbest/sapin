import {expect} from 'chai'
import {Errors, defaultConfig as config} from '../src/common'
import {
  required,
  requiredIfOtherFieldIsTrue,
  requiredIfOtherFieldIsFalse,
  requiredIfOtherFieldEquals
} from '../src/required-validators'

describe('required', function () {
  it('returns Errors.required when given null value', function () {
    const ret = required({value: null, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: null}
    })
  })

  it('returns Errors.required when given undefined', function () {
    const ret = required({value: undefined, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: undefined}
    })
  })

  it('returns Errors.required when given \'\'', function () {
    const ret = required({value: '', config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: ''}
    })
  })

  it('returns null when given a value', function () {
    const ret = required({value: 'yo', config})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsTrue', function () {
  it('returns Errors.required when other field value is true and null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: null, siblings: {otherField: true}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: null}
    })
  })

  it('returns Errors.required when other field value is true and undefined value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: undefined, siblings: {otherField: true}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: undefined}
    })
  })

  it('returns Errors.required when other field value is true and \'\' value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: '', siblings: {otherField: true}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: ''}
    })
  })

  it('returns null when other field value is true and a valid string given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: 'yo', siblings: {otherField: false}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is false even when null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: '', siblings: {otherField: false}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is undefined even when null value given', function () {
    const validate = requiredIfOtherFieldIsTrue('otherField')
    const ret = validate({value: null, siblings: {}, config})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldIsFalse', function () {
  it('returns Errors.required when other field value is false and null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: null, siblings: {otherField: false}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: null}
    })
  })

  it('returns Errors.required when other field value is false and undefined value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: undefined, siblings: {otherField: false}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: undefined}
    })
  })

  it('returns Errors.required when other field value is false and \'\' value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: '', siblings: {otherField: false}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: ''}
    })
  })

  it('returns null when other field value is false and a valid string given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: 'yo', siblings: {otherField: true}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is true even when null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: '', siblings: {otherField: true}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is undefined even when null value given', function () {
    const validate = requiredIfOtherFieldIsFalse('otherField')
    const ret = validate({value: null, siblings: {}, config})
    expect(ret).to.equal(null)
  })
})

describe('requiredIfOtherFieldEquals', function () {
  it('returns null when other field value is undefined', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is null', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {otherField: null}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is empty string', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {otherField: ''}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is not a target value', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: null, siblings: {otherField: 'sdfsd'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when other field value is not one of the target values', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate({value: null, siblings: {otherField: 'sdfsd'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate({value: 'yo', siblings: {otherField: 'test'}, config})
    expect(ret).to.equal(null)
  })

  it('returns Error.required when given no value and other field value matches one of expected', function () {
    const validate = requiredIfOtherFieldEquals('otherField', ['test', 'test2'])
    const ret = validate({value: '', siblings: {otherField: 'test'}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: ''}
    })
  })

  it('returns Error.required when given no value and other field value matches expected', function () {
    const validate = requiredIfOtherFieldEquals('otherField', 'test')
    const ret = validate({value: '', siblings: {otherField: 'test'}, config})
    expect(ret).to.deep.equal({
      error: Errors.required,
      params: {value: ''}
    })
  })
})
